import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiPackage, FiEye } from "react-icons/fi";
import { fetchMyOrders } from "../store/slices/orderSlice";
import Loader from "../components/atoms/Loader";
import { formatPrice } from "../utils/formatPrice";
import { ORDER_STATUSES } from "../utils/constants";
const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);
  const getStatusColor = (status) => {
    return (
      ORDER_STATUSES.find((s) => s.value === status)?.color ||
      "bg-gray-100 text-gray-700"
    );
  };
  if (loading) return <Loader />;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 ">
      {" "}
      <h1 className="font-sans text-2xl md:text-3xl font-bold mb-8">
        My Orders
      </h1>{" "}
      {orders.length === 0 ? (
        <div className="text-center py-20">
          {" "}
          <FiPackage className="w-16 h-16 mx-auto text-neutral-400 mb-4" />{" "}
          <h3 className="font-sans font-bold text-xl mb-2">No orders yet</h3>{" "}
          <p className="text-neutral-400 mb-6">
            Start shopping to see your orders here
          </p>{" "}
          <Link
            to="/shop"
            className="bg-amber-500 text-neutral-900 font-semibold px-6 py-3 rounded-xl hover:bg-amber-600 transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Shop Now
          </Link>{" "}
        </div>
      ) : (
        <div className="space-y-4">
          {" "}
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl rounded-xl p-4 md:p-6"
            >
              {" "}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {" "}
                <div>
                  {" "}
                  <div className="flex items-center gap-3 mb-1">
                    {" "}
                    <p className="font-mono text-xs text-neutral-400">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>{" "}
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}
                    >
                      {" "}
                      {order.orderStatus}{" "}
                    </span>{" "}
                  </div>{" "}
                  <p className="text-sm text-neutral-400">
                    {" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    {" • "}
                    {order.items.length} item
                    {order.items.length > 1 ? "s" : ""}{" "}
                  </p>{" "}
                </div>{" "}
                <div className="flex items-center gap-4">
                  {" "}
                  <p className="font-bold text-lg">
                    {formatPrice(order.totalPrice)}
                  </p>{" "}
                  <Link
                    to={`/orders/${order._id}`}
                    className="bg-transparent text-neutral-900 font-semibold px-6 py-3 rounded-xl border-2 border-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300 active:scale-95 py-2 px-4 text-sm flex items-center gap-2"
                  >
                    {" "}
                    <FiEye className="w-4 h-4" /> View{" "}
                  </Link>{" "}
                </div>{" "}
              </div>{" "}
              <div className="flex gap-3 mt-4 overflow-x-auto">
                {" "}
                {order.items.slice(0, 4).map((item, i) => (
                  <img
                    key={i}
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                ))}{" "}
                {order.items.length > 4 && (
                  <div className="w-16 h-16 rounded-lg bg-neutral-100 flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {" "}
                    +{order.items.length - 4}{" "}
                  </div>
                )}{" "}
              </div>{" "}
            </div>
          ))}{" "}
        </div>
      )}{" "}
    </div>
  );
};
export default Orders;
