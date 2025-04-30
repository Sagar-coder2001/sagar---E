// Productdetailspage.jsx

import { useEffect, useState } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
import { RadioGroup } from '@headlessui/react'
import Layout from '../../Components/Client/Layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { fetchproductByIdasync, selectproductById } from '../../Features/Productslice'
import { useParams } from 'react-router-dom'
import { addToCartAsync, cartstatus } from '../../Features/Cartslice'
import { selectLoggedInUser } from '../../Features/Authslice'
import Protected from './Protected'
import ScrollTop from '../../Components/Client/Common/Scolltop'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const reviews = { average: 4, totalCount: 117 }

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Productdetailspage() {
  const product = useSelector(selectproductById)
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || {})
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || {})
  const [selectedImage, setSelectedImage] = useState(null)
  const bgcolor = useSelector((state) => state.theme.value)
  const txtcolor = useSelector((state) => state.theme.textcolor)

  const dispatch = useDispatch()
  const params = useParams()
  const user = useSelector(selectLoggedInUser)
  const status = useSelector(cartstatus)

  useEffect(() => {
    dispatch(fetchproductByIdasync(params.id))
  }, [dispatch, params.id])

  const handleCart = (e) => {
    e.preventDefault()
    dispatch(addToCartAsync({ product: product.id, quantity: 1, user: user.id }))
  }

  if (status === 'loading') {
    toast.info('Adding to cart...', { autoClose: 2000 })
  }



  return (
    <Layout>
      <Protected>
        <ScrollTop />
        <ToastContainer />
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
                      reviews.average > rating ? 'text-yellow-500' : 'text-gray-300',
                      'h-5 w-5'
                    )}
                  />
                ))}
                <span className="ml-2 text-sm">({reviews.totalCount} reviews)</span>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-2xl font-bold text-indigo-600">
                  ₹{Math.floor(product.price / product.discountPercentage)}
                </p>
                <p className="text-lg line-through text-gray-400">₹{product.price}</p>
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
                  <h3 className="text-sm font-semibold  mb-1">Size</h3>
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
                                : '',
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

              <button
                onClick={handleCart}
                className="mt-6 w-full bg-indigo-600 py-3 rounded-md hover:bg-indigo-700 transition duration-200"
              >
                Add to Cart
              </button>

              <div>
                <h2 className="text-lg font-semibold mt-6">Description</h2>
                <p className="mt-2">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </Protected>
    </Layout>
  )
}
