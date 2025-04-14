import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Layout from '../../Components/Client/Layout/Layout';
import { brands, categories, selectproductById, createProductAsync, fetchproductByIdasync, updateProductAsync, updateproductstatus } from '../../Features/Productslice';
import { selectLoggedInUser } from '../../Features/Authslice';
import ProtectedAdmin from './ProtectedAdmin';
import Adminsidebar from './Adminsidebar';
import ScrollTop from '../../Components/Client/Common/Scolltop';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Adminproductformpage() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const params = useParams();
  const selectedProduct = useSelector(selectproductById);
  const category = useSelector(categories);
  const brand = useSelector(brands);
  const user = useSelector(selectLoggedInUser);
  const status = useSelector(updateproductstatus);
  const bgcolor = useSelector((state) => state.theme.value)
  const txtcolor = useSelector((state) => state.theme.textcolor)


  const colors = [
    { name: 'White', id: 'white' },
    { name: 'Gray', id: 'gray' },
    { name: 'Black', id: 'black' },
  ];

  const sizes = [
    { name: 'XXS', id: 'xxs' },
    { name: 'XS', id: 'xs' },
    { name: 'S', id: 's' },
    { name: 'M', id: 'm' },
    { name: 'L', id: 'l' },
    { name: 'XL', id: 'xl' },
    { name: '2XL', id: '2xl' },
    { name: '3XL', id: '3xl' },
  ];

  useEffect(() => {
    if (params.id) {
      dispatch(fetchproductByIdasync(params.id));
    } else {
      // dispatch(clearSelectedProduct());
    }
  }, [params.id, dispatch]);

  useEffect(() => {
    if (selectedProduct && params.id) {
      setValue('title', selectedProduct.title);
      setValue('description', selectedProduct.description);
      setValue('price', selectedProduct.price);
      setValue('discountPercentage', selectedProduct.discountPercentage);
      setValue('stock', selectedProduct.stock);
      setValue('image1', selectedProduct.images?.[0] || '');
      setValue('image2', selectedProduct.images?.[1] || '');
      setValue('image3', selectedProduct.images?.[2] || '');
      setValue('thumbnail', selectedProduct.images?.[3] || '');
      setValue('brand', selectedProduct.brand);
      setValue('category', selectedProduct.category);
      setValue('highlight1', selectedProduct.highlights?.[0] || '');
      setValue('highlight2', selectedProduct.highlights?.[1] || '');
      setValue('highlight3', selectedProduct.highlights?.[2] || '');
      setValue('highlight4', selectedProduct.highlights?.[3] || '');
      setValue('sizes', selectedProduct?.sizes?.map((size) => size.id) || []);
      setValue('colors', selectedProduct?.colors?.map((color) => color.id) || []);

    }
  }, [selectedProduct, params.id, setValue]);

  // const handleDelete = () => {
  //   const product = { ...selectedProduct };
  //   product.deleted = true;
  //   dispatch(updateProductAsync(product));
  // };


  useEffect(() => {
    if (status === 'loading') {
      toast.success('Product updated successfully');
    }
  }, [status]);

  return (
    <Layout>
      {/* {
          user.role !== 'admin' && <><Navigate to='/'></Navigate></>
        } */}
      <ProtectedAdmin>
        <Adminsidebar />
        <ScrollTop />
        <ToastContainer />

        <div className='sm:ml-64 mt-10'>
          <form
            noValidate
            onSubmit={handleSubmit((data) => {
              const product = { ...data };
              product.images = [
                product.image1,
                product.image2,
                product.image3,
                product.thumbnail,
              ].filter(Boolean);
              product.highlights = [
                product.highlight1,
                product.highlight2,
                product.highlight3,
                product.highlight4,
              ].filter(Boolean);
              product.rating = 0;
              if (product.colors) {
                product.colors = product.colors.map((color) =>
                  colors.find((clr) => clr.id === color)
                );
              }
              if (product.sizes) {
                product.sizes = product.sizes.map((size) =>
                  sizes.find((sz) => sz.id === size)
                );
              }

              delete product['image1'];
              delete product['image2'];
              delete product['image3'];
              product.price = +product.price;
              product.stock = +product.stock;
              product.discountPercentage = +product.discountPercentage;
              if (params.id) {
                product.id = params.id;
                product.rating = selectedProduct.rating || 0;
                dispatch(updateProductAsync(product));

                reset();
              } else {
                dispatch(createProductAsync(product));
                alert('Product Created');
                reset();
              }
            })}
          >
            <div className="space-y-12 p-12" style={{ backgroundColor: bgcolor, color: txtcolor }} >
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7">
                  Add Product
                </h2>


                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  {selectedProduct && selectedProduct.deleted && (
                    <h2 className="text-red-500 sm:col-span-6">
                      This product is deleted
                    </h2>
                  )}

                  <div className="sm:col-span-6">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium leading-6 "
                    >
                      Product Name
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                        <input
                          type="text"
                          {...register('title', {
                            required: 'name is required',
                          })}
                          id="title"
                          className="block flex-1 border-0 bg-transparent py-3 pl-1  placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium leading-6 "
                    >
                      Description
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="description"
                        {...register('description', {
                          required: 'description is required',
                        })}
                        rows={3}
                        className="block w-full p-2 rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={''}
                      />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      Write a few sentences about product.
                    </p>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="brand"
                      className="block text-sm font-medium leading-6 "
                    >
                      Brand
                    </label>
                    <div className="mt-2">
                      <select
                        {...register('brand', {
                          required: 'brand is required',
                        })}
                        className='w-full border border-amber-300 rounded px-3 py-2'
                        style={{ backgroundColor: bgcolor, color: txtcolor }}

                      >
                        <option value="" >--choose brand--</option>
                        {brand.map((brand) => (
                          <option key={brand.value} value={brand.value}>
                            {brand.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="colors"
                      className="block text-sm font-medium leading-6 "
                    >
                      Colors
                    </label>
                    <div className="mt-2 flex flex-wrap gap-4">
                      {colors.map((color, index) => (
                        <div key={color.id}>
                          <input
                            type="checkbox"
                            {...register(`colors[${index}]`)}  // Register each checkbox as an array item using index
                            value={color.id}
                          />
                          {color.name}
                        </div>
                      ))}

                    </div>
                  </div>

                  <div className="col-span-full">
                    <label htmlFor="sizes" className="block text-sm font-medium leading-6">Sizes</label>
                    <div className="mt-2 flex flex-wrap gap-4">
                      {sizes.map((size, index) => (
                        <label key={size.id} htmlFor={`size-${size.id}`} className="flex items-center space-x-1">
                          <input
                            type="checkbox"
                            {...register('sizes')}
                            value={size.id}
                            id={`size-${size.id}`}
                          />
                          <span>{size.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label htmlFor="category" className="block text-sm font-medium leading-6">
                      Category
                    </label>
                    <div className="mt-2">
                      <select
                        {...register('category', {
                          required: 'category is required',
                        })}
                        className="w-full border border-amber-300 rounded px-3 py-2"
                        style={{ backgroundColor: bgcolor, color: txtcolor }}
                      >
                        <option value="">--choose category--</option>
                        {category.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium leading-6 "
                    >
                      Price
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                        <input
                          type="number"
                          {...register('price', {
                            required: 'price is required',
                            min: 1,
                            max: 10000,
                          })}
                          id="price"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1  placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="discountPercentage"
                      className="block text-sm font-medium leading-6 "
                    >
                      Discount Percentage
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                        <input
                          type="number"
                          {...register('discountPercentage', {
                            required: 'discountPercentage is required',
                            min: 0,
                            max: 100,
                          })}
                          id="discountPercentage"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1  placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="stock"
                      className="block text-sm font-medium leading-6 "
                    >
                      Stock
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                        <input
                          type="number"
                          {...register('stock', {
                            required: 'stock is required',
                            min: 0,
                          })}
                          id="stock"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1  placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label
                      htmlFor="thumbnail"
                      className="block text-sm font-medium leading-6 "
                    >
                      Thumbnail
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                        <input
                          type="text"
                          {...register('thumbnail', {
                            required: 'thumbnail is required',
                          })}
                          id="thumbnail"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1  placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label
                      htmlFor="image1"
                      className="block text-sm font-medium leading-6 "
                    >
                      Image 1
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                        <input
                          type="text"
                          {...register('image1', {
                            required: 'image1 is required',
                          })}
                          id="image1"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1  placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label
                      htmlFor="image2"
                      className="block text-sm font-medium leading-6 "
                    >
                      Image 2
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                        <input
                          type="text"
                          {...register('image2', {
                            required: 'image is required',
                          })}
                          id="image2"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1  placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label
                      htmlFor="image2"
                      className="block text-sm font-medium leading-6 "
                    >
                      Image 3
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                        <input
                          type="text"
                          {...register('image3', {
                            required: 'image is required',
                          })}
                          id="image3"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1  placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label
                      htmlFor="highlight1"
                      className="block text-sm font-medium leading-6 "
                    >
                      Highlight 1
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                        <input
                          type="text"
                          {...register('highlight1', {})}
                          id="highlight1"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1  placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="highlight2"
                      className="block text-sm font-medium leading-6 "
                    >
                      Highlight 2
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                        <input
                          type="text"
                          {...register('highlight2', {})}
                          id="highlight2"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1  placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="highlight3"
                      className="block text-sm font-medium leading-6 "
                    >
                      Highlight 3
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                        <input
                          type="text"
                          {...register('highlight3', {})}
                          id="highlight3"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1  placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="highlight4"
                      className="block text-sm font-medium leading-6 "
                    >
                      Highlight 4
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                        <input
                          type="text"
                          {...register('highlight4', {})}
                          id="highlight4"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1  placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 "
                >
                  Cancel
                </button>

                {selectedProduct && !selectedProduct.deleted && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenModal(true);
                    }}
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Delete
                  </button>
                )}

                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save
                </button>
              </div>
            </div>


          </form>
        </div>
      </ProtectedAdmin>

    </Layout>
  );
}
