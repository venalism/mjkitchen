import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to MJ Kitchen
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Delicious homemade meals delivered to your door
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/menu"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
              >
                View Menu
              </Link>
              <Link
                to="/register"
                className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition border-2 border-white"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="text-xl font-bold mb-2">Fresh Ingredients</h3>
            <p className="text-gray-600">
              We use only the freshest ingredients in all our dishes
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">
              Hot meals delivered to your doorstep in 30 minutes or less
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-bold mb-2">Quality Service</h3>
            <p className="text-gray-600">
              Rated 4.8/5 by our satisfied customers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;