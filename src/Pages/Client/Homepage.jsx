
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import Layout from '../../Components/Client/Layout/Layout'
import { Link, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectallproducts, fetchallproductfilterasync, categories, brands, fetchcategoryasync, fetchbrandasync, selectTotalItems, selectstatus } from '../../Features/Productslice'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Protected from './Protected'
import { GridLoader } from 'react-spinners'
import Carousle from './Carousle'
import { selectLoggedInUser } from '../../Features/Authslice'
import ScrollTop from '../../Components/Client/Common/Scolltop'

const sortOptions = [
  { name: 'Best Rating', sort: 'rating', order: 'desc', current: false },
  { name: 'Price: Low to High', sort: 'price', order: 'asc', current: false },
  { name: 'Price: High to Low', sort: 'price', order: 'desc', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Homepage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({})
  const [sort, SetSort] = useState('')
  const user = useSelector(selectLoggedInUser);

  const products = useSelector(selectallproducts);
  const category = useSelector(categories);
  const brand = useSelector(brands);

  const [page, setPage] = useState(1)
  const [itemsPerPage] = useState(9)
  const totalItems = products && products.totalItems ? products.totalItems : 0

  const productStatus = useSelector(selectstatus);   

  // Get current products for the current page
  const indexOfLastProduct = page * itemsPerPage
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage
  const currentProducts = products && products.products ? products.products.slice(indexOfFirstProduct, indexOfLastProduct) : []


  const filters = [
    {
      id: 'category',
      name: 'Category',
      options: category
    },
    {
      id: 'Brand',
      name: 'Brand',
      options: brand
    },
  ]

  const handleFilter = (e, section, option) => {
    const newFilter = { ...filter };
    if (e.target.checked) {
      newFilter[section.id] = option.value;
    } else {
      delete newFilter(section.id);
    }

    setFilter(newFilter);
  };

  const handleSort = (e, option) => {
    const sort = { _sort: option.sort, _order: option.order };
    SetSort(sort);
  };

  useEffect(() => {
    if(user){
      dispatch(fetchallproductfilterasync(filter, sort));
    }
  }, [dispatch, filter, sort])

  useEffect(() => {
    dispatch(fetchcategoryasync());
    dispatch(fetchbrandasync());
  }, [dispatch])


  const handlePage = (_, pageNumber) => {
    // Validate page number to prevent going below 1 or above max pages
    const maxPage = Math.ceil(totalItems / itemsPerPage)
    if (pageNumber < 1 || pageNumber > maxPage) return

    setPage(pageNumber)
  }

    // const role = JSON.parse(localStorage.getItem('role'));
    // if (role === 'admin') {
    //   return <Navigate to="/Adminhomepage" />;
    // } else if (role === 'user') {
    //   return <Navigate to="/" />;
    // } 
    // else{
    //   return <Navigate to="/Loginpage" />;
    // }

  if (productStatus === 'loading') {

    return (
      <>
      <div className="flex items-center justify-center h-screen">
      <GridLoader />
      </div>
      </>
    )
  }

  return (
    <Layout>
      <Protected>
      
        <div className="bg-white mt-10">
          <div>

            <Carousle/>

            {/* Mobile filter dialog */}
            <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
              <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
              />

              <div className="fixed inset-0 z-40 flex">
                <DialogPanel
                  transition
                  className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
                >
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                    <button
                      type="button"
                      onClick={() => setMobileFiltersOpen(false)}
                      className="-mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon aria-hidden="true" className="size-6" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4 border-t border-gray-200">

                    {filters.map((section) => (
                      <Disclosure key={section.id} as="div" className="border-t border-gray-200 px-4 py-6">
                        <h3 className="-mx-2 -my-3 flow-root">
                          <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">{section.name}</span>
                            <span className="ml-6 flex items-center">
                              <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                              <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                            </span>
                          </DisclosureButton>
                        </h3>
                        <DisclosurePanel className="pt-6">
                          <div className="space-y-6">
                            {section.options.map((option, optionIdx) => (
                              <div key={option.value} className="flex gap-3">
                                <div className="flex h-5 shrink-0 items-center">
                                  <div className="group grid size-4 grid-cols-1">
                                    <input
                                      defaultValue={option.value}
                                      id={`filter-mobile-${section.id}-${optionIdx}`}
                                      name={`${section.id}[]`}
                                      type="checkbox"
                                      onChange={(e) => handleFilter(e, section, option)}
                                      className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                    />
                                    <svg
                                      fill="none"
                                      viewBox="0 0 14 14"
                                      className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                    >
                                      <path
                                        d="M3 8L6 11L11 3.5"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="opacity-0 group-has-checked:opacity-100"
                                      />
                                      <path
                                        d="M3 7H11"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="opacity-0 group-has-indeterminate:opacity-100"
                                      />
                                    </svg>
                                  </div>
                                </div>
                                <label
                                  htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                  className="min-w-0 flex-1 text-gray-500"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </DisclosurePanel>
                      </Disclosure>
                    ))}
                  </form>
                </DialogPanel>
              </div>
            </Dialog>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-baseline justify-between border-b border-gray-200 pt-10 pb-6">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">All Products</h1>

                <div className="flex items-center">
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                        Sort
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                        />
                      </MenuButton>
                    </div>

                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white ring-1 shadow-2xl ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                    >
                      <div className="py-1">
                        {sortOptions.map((option) => (
                          <MenuItem key={option.name}>
                            <p
                              onClick={(e) => handleSort(e, option)}
                              className={classNames(
                                option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                'block px-4 py-2 text-sm data-focus:bg-gray-100 data-focus:outline-hidden',
                              )}
                            >
                              {option.name}
                            </p>
                          </MenuItem>
                        ))}
                      </div>
                    </MenuItems>
                  </Menu>

                  <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                    <span className="sr-only">View grid</span>
                    <Squares2X2Icon aria-hidden="true" className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(true)}
                    className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                  >
                    <span className="sr-only">Filters</span>
                    <FunnelIcon aria-hidden="true" className="size-5" />
                  </button>
                </div>
              </div>

              <section aria-labelledby="products-heading" className="pt-6 pb-10">
                <h2 id="products-heading" className="sr-only">
                  Products
                </h2>

                <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                  {/* Filters */}
                  <form className="hidden lg:block">

                    {filters.map((section) => (
                      <Disclosure key={section.id} as="div" className="border-b border-gray-200 py-6">
                        <h3 className="-my-3 flow-root">
                          <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">{section.name}</span>
                            <span className="ml-6 flex items-center">
                              <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                              <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                            </span>
                          </DisclosureButton>
                        </h3>
                        <DisclosurePanel className="pt-6">
                          <div className="space-y-4">
                            {
                              section.options.map((option, optionIdx) => (
                                <div key={option.value} className="flex gap-3">
                                  <div className="flex h-5 shrink-0 items-center">
                                    <div className="group grid size-4 grid-cols-1">
                                      <input
                                        defaultValue={option.value}
                                        defaultChecked={option.checked}
                                        id={`filter-${section.id}-${optionIdx}`}
                                        name={`${section.id}[]`}
                                        type="checkbox"
                                        onChange={(e) => handleFilter(e, section, option)}
                                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                      />
                                      <svg
                                        fill="none"
                                        viewBox="0 0 14 14"
                                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                      >
                                        <path
                                          d="M3 8L6 11L11 3.5"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="opacity-0 group-has-checked:opacity-100"
                                        />
                                        <path
                                          d="M3 7H11"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="opacity-0 group-has-indeterminate:opacity-100"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                  <label htmlFor={`filter-${section.id}-${optionIdx}`} className="text-sm text-gray-600">
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                          </div>
                        </DisclosurePanel>
                      </Disclosure>
                    ))}
                  </form>

                  {/* Product grid */}
                  <div className="lg:col-span-3">
                    {
                      <div className="bg-white">
                        <div className="mx-auto max-w-2xl px-4 lg:max-w-7xl">

                          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                            {currentProducts && currentProducts.length > 0 ? (
                              currentProducts.map((product) => (
                                <Link to={`/Productdetailspage/${product.id}`} key={product.id}>
                                  <div className="group relative bg-blue-50 p-2 rounded-md ">
                                    <LazyLoadImage
                                      alt={product.images[1]}
                                      src={product.images[1]}
                                      className="aspect-square w-full p-4 rounded-md object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                                      effect="blur"
                                      wrapperProps={{
                                        style: { transitionDelay: "1s" },
                                      }}
                                    />
                                    <div className="mt-4 flex justify-between">
                                      <div>
                                        <h3 className="text-sm text-gray-900">{product.title}</h3>
                                        <p className="mt-1 text-sm text-gray-500">{product.rating}</p>
                                      </div>
                                      <p className="text-sm font-medium text-gray-900">${product.price}</p>
                                    </div>
                                  </div>
                                </Link>
                              ))
                            ) : (
                              <p>No products available.</p>
                            )}

                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </section>

              {/* pagination here */}
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => handlePage(null, page - 1)}
                    disabled={page === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePage(null, page + 1)}
                    disabled={page >= Math.ceil(totalItems / itemsPerPage)}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{totalItems ? (page - 1) * itemsPerPage + 1 : 0}</span> to{" "}
                      <span className="font-medium">{Math.min(page * itemsPerPage, totalItems)}</span> of{" "}
                      <span className="font-medium">{totalItems}</span> results
                    </p>
                  </div>
                  <div>
                    <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                      <button
                        onClick={() => handlePage(null, page - 1)}
                        disabled={page === 1}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon aria-hidden="true" className="size-5" />
                      </button>

                      {Array.from({ length: Math.min(5, Math.ceil(totalItems / itemsPerPage)) }).map((_, index) => {
                        // Show pages around the current page
                        let pageNumber
                        const totalPages = Math.ceil(totalItems / itemsPerPage)

                        if (totalPages <= 5) {
                          pageNumber = index + 1
                        } else {
                          // More complex pagination logic for many pages
                          if (page <= 3) {
                            pageNumber = index + 1
                          } else if (page >= totalPages - 2) {
                            pageNumber = totalPages - 4 + index
                          } else {
                            pageNumber = page - 2 + index
                          }
                        }

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePage(null, pageNumber)}
                            aria-current={page === pageNumber ? "page" : undefined}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${page === pageNumber
                                ? "bg-indigo-600 text-white focus-visible:outline-indigo-600 z-10"
                                : "text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
                              } focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
                          >
                            {pageNumber}
                          </button>
                        )
                      })}

                      <button
                        onClick={() => handlePage(null, page + 1)}
                        disabled={page >= Math.ceil(totalItems / itemsPerPage)}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRightIcon aria-hidden="true" className="size-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </main>


          </div>
        </div>



      </Protected>
    </Layout>

  )
}
