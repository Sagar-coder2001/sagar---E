
import { useEffect, useState } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
import { Radio, RadioGroup } from '@headlessui/react'
import Layout from '../../Components/Client/Layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { fetchproductByIdasync, selectproductById } from '../../Features/Productslice'
import { Link, useParams } from 'react-router-dom'
import { addToCartAsync } from '../../Features/Cartslice'
import { selectLoggedInUser } from '../../Features/Authslice'
import ProtectedAdmin from './ProtectedAdmin'
import ScrollTop from '../../Components/Client/Common/Scolltop'

const reviews = { href: '#', average: 4, totalCount: 117 }

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Adminproductdetailpage() {
  // const [selectedColor, setSelectedColor] = useState(product.colors[0])
  // const [selectedSize, setSelectedSize] = useState(product.sizes[2])
  const dispatch = useDispatch();
  const product = useSelector(selectproductById);

  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || {})
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || {})
  const params = useParams();
  const user = useSelector(selectLoggedInUser);
  const bgcolor = useSelector((state) => state.theme.value)
  const txtcolor = useSelector((state) => state.theme.textcolor)

  useEffect(() => {
    dispatch(fetchproductByIdasync(params.id));
  }, [dispatch, params.id])


  const handleCart = (e) => {
    // e.preventDefault();
    dispatch(addToCartAsync({ ...product, quantity: 1, user: user.id }));

  }



  return (
    <Layout>
      <ProtectedAdmin>
        <ScrollTop />
        <div className="py-10 mt-10" style={{ backgroundColor: bgcolor, color: txtcolor }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left - Image gallery */}
            {/* Left - Image gallery */}
            <div className="space-y-6">
              <div className="w-full h-[400px] overflow-hidden rounded-lg">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Selected Product"
                    className="w-full h-full object-cover object-center rounded-lg shadow-md transition duration-300 ease-in-out"
                  />
                ) :
                  <img
                    src={product?.images?.[0]}
                    alt="Product"
                    className="w-full h-full object-cover object-center rounded-lg shadow-md transition duration-300 ease-in-out"
                  />


                }
              </div>

              <div className="grid grid-cols-4 gap-4">
                {product.images?.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={classNames(
                      'rounded-md overflow-hidden border-2 transition-all duration-200',
                      selectedImage === img ? 'border-indigo-600' : 'border-transparent'
                    )}
                  >
                    <img
                      src={img}
                      alt={`thumbnail-${i}`}
                      className="w-full h-24 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </button>
                ))}
              </div>
            </div>


            {/* Right - Product details */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">{product.title}</h1>

              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    className={classNames(
                      reviews.average > rating ? 'text-yellow-500' : '',
                      'h-5 w-5'
                    )}
                  />
                ))}
                <span className="ml-2 text-sm ">({reviews.totalCount} reviews)</span>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-2xl font-bold text-indigo-600">
                  ₹{Math.floor(product.price / product.discountPercentage)}
                </p>
                <p className="text-lg line-through">₹{product.price}</p>
              </div>

              {/* Color options */}
              {product.colors?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-1">Color</h3>
                  <RadioGroup value={selectedColor} onChange={setSelectedColor} className="flex gap-3">
                    {product.colors.map((color, i) => (
                      <RadioGroup.Option key={i} value={color}>
                        {({ checked }) => (
                          <span
                            className={classNames(
                              'w-8 h-8 rounded-full cursor-pointer border',
                              checked ? 'ring-2 ring-indigo-500 border-none' : 'border-gray-300'
                            )}
                            style={{ backgroundColor: color.code }}
                          />
                        )}
                      </RadioGroup.Option>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Size options */}
              {product.sizes?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-1">Size</h3>
                  <RadioGroup
                    value={selectedSize}
                    onChange={setSelectedSize}
                    className="grid grid-cols-4 gap-2"
                  >
                    {product.sizes.map((size) => (
                      <RadioGroup.Option key={size.name} value={size} disabled={!size.inStock}>
                        {({ checked, disabled }) => (
                          <span
                            className={classNames(
                              'flex items-center justify-center py-2 text-sm font-medium uppercase border rounded-md',
                              checked
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white hover:bg-gray-100',
                              disabled && 'opacity-50 cursor-not-allowed'
                            )}
                          >
                            {size.name}
                          </span>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </RadioGroup>
                </div>
              )}

              <Link
                to={`/Adminproductformpage/edit/${product.id}`}
                className="mt-2 w-full flex items-center justify-center rounded-md bg-blue-100 k p-2 text-gray-900"
              >Edit Product
              </Link>

              <div>
                <h2 className="text-lg font-semibold mt-6">Description</h2>
                <p className="mt-2">{product.description}</p>
              </div>
            </div>
          </div>
        </div>

      </ProtectedAdmin>
    </Layout>

  )
}
