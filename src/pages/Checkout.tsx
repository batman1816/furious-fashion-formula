import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import CheckoutForm from '../components/checkout/CheckoutForm';

const Checkout = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some amazing F1 apparel to get started!</p>
          <Link 
            to="/" 
            className="inline-block bg-black hover:bg-gray-800 text-white px-8 py-3 font-semibold transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const total = getCartTotal();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Desktop and Mobile Layout */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-16">
          {/* Left Side - Cart Items */}
          <div className="flex-1 lg:max-w-3xl">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl lg:text-4xl font-poppins-extralight font-extralight text-gray-900">Your cart</h1>
              <Link 
                to="/" 
                className="text-gray-600 hover:text-gray-900 underline font-poppins-extralight font-extralight text-sm lg:text-base"
              >
                Continue shopping
              </Link>
            </div>

            {/* Header Row for Desktop */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-4 pb-4 border-b border-gray-200 mb-6">
              <div className="col-span-6">
                <span className="text-xs uppercase text-gray-500 font-poppins-extralight font-extralight tracking-wider">PRODUCT</span>
              </div>
              <div className="col-span-3 text-center">
                <span className="text-xs uppercase text-gray-500 font-poppins-extralight font-extralight tracking-wider">QUANTITY</span>
              </div>
              <div className="col-span-3 text-right">
                <span className="text-xs uppercase text-gray-500 font-poppins-extralight font-extralight tracking-wider">TOTAL</span>
              </div>
            </div>

            {/* Cart Items */}
            <div className="space-y-6 lg:space-y-8">
              {cartItems.map((item, index) => (
                <div key={`${item.product.id}-${item.size}-${item.color || 'default'}`} className="flex flex-col lg:grid lg:grid-cols-12 gap-4 pb-6 lg:pb-8 border-b border-gray-100">
                  {/* Product Info */}
                  <div className="lg:col-span-6 flex gap-4">
                    <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-poppins-light font-light text-base lg:text-lg text-gray-900 mb-2">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-500 text-sm font-poppins-extralight font-extralight mb-2">
                        Tk {item.product.price.toFixed(2)}
                      </p>
                      <p className="text-gray-500 text-sm font-poppins-extralight font-extralight">
                        SIZE: {item.size}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="lg:col-span-3 flex lg:justify-center items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1, item.color)}
                          className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-2 text-center min-w-[60px] font-poppins-extralight font-extralight">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1, item.color)}
                          className="p-2 hover:bg-gray-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="lg:col-span-3 flex lg:justify-end items-center">
                    <div className="text-right">
                      <p className="font-poppins-light font-light text-lg lg:text-xl text-gray-900">
                        Tk {(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Order Summary for Desktop, Bottom for Mobile */}
          <div className="lg:w-80 mt-8 lg:mt-0">
            <div className="bg-white lg:sticky lg:top-8">
              {/* Total Section */}
              <div className="border-t border-gray-200 pt-6 lg:pt-8">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg lg:text-xl font-poppins-extralight font-extralight text-gray-900">total</span>
                  <span className="text-xl lg:text-2xl font-poppins-light font-light text-gray-900">
                    Tk {total.toFixed(2)} BDT
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 font-poppins-extralight font-extralight mb-8">
                  shipping calculated at checkout.
                </p>

                <Link
                  to="/checkout"
                  className="w-full bg-black hover:bg-gray-800 text-white py-4 px-6 font-poppins-light font-light text-center transition-colors duration-200 block text-lg"
                >
                  Check out
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;