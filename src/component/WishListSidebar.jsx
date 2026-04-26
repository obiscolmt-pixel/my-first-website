import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsFillCartFill } from "react-icons/bs";
import { MdFavorite } from "react-icons/md";

const WishlistSidebar = ({
  wishlistOpen,
  setWishlistOpen,
  wishlist,
  addToCart,
  addToWishlist,
}) => {
  const handleClose = () => setWishlistOpen(false);

  return (
    <>
      {/* Overlay */}
      {wishlistOpen && (
        <div
          className="bg-black/60 fixed w-full h-screen z-[60] top-0 left-0"
          onClick={handleClose}
        />
      )}

      {/* Drawer */}
      <div
        className={
          wishlistOpen
            ? "fixed top-0 right-0 w-full sm:w-[420px] h-screen bg-white z-[70] duration-300 flex flex-col"
            : "fixed top-0 right-[-100%] w-full sm:w-[420px] h-screen bg-white z-[70] duration-300 flex flex-col"
        }
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <MdFavorite className="text-red-500" />
            Wishlist
            <span className="text-red-500 text-lg">({wishlist.length})</span>
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-black transition p-1"
          >
            <AiOutlineClose size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <MdFavorite size={50} className="text-gray-200 mb-4" />
              <p className="text-gray-500 text-base sm:text-lg font-semibold">
                Your wishlist is empty
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                Click the ❤️ on any product to save it!
              </p>
              <button
                onClick={handleClose}
                className="mt-6 bg-orange-500 text-white px-6 py-2.5 rounded-full hover:bg-orange-600 transition text-sm font-semibold"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {wishlist.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 border rounded-xl p-2.5 sm:p-3 shadow-sm"
                >
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs sm:text-sm truncate">
                      {item.name}
                    </p>
                    <p className="text-orange-500 text-xs capitalize">
                      {item.category}
                    </p>
                    <p className="text-orange-600 font-bold text-xs sm:text-sm mt-0.5">
                      ₦{item.amount.toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {/* Remove from wishlist */}
                    <button
                      onClick={() => addToWishlist(item)}
                      className="text-red-400 hover:text-red-600 transition"
                    >
                      <MdFavorite size={20} />
                    </button>
                    {/* Add to cart */}
                    <button
                      onClick={() => {
                        addToCart({ ...item, quantity: 1 });
                        handleClose();
                      }}
                      className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition"
                    >
                      <BsFillCartFill size={12} />
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t bg-gray-50 shrink-0">
            <button
              onClick={() => {
                wishlist.forEach((item) => addToCart({ ...item, quantity: 1 }));
                handleClose();
              }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full transition text-sm flex items-center justify-center gap-2"
            >
              <BsFillCartFill size={16} />
              Add All to Cart ({wishlist.length} items)
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default WishlistSidebar;
