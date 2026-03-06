import { Link } from "react-router-dom";
import { FiHome, FiArrowLeft } from "react-icons/fi";
const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 ">
      {" "}
      <div className="text-center">
        {" "}
        <h1 className="font-sans text-8xl md:text-9xl font-black text-amber-500">
          404
        </h1>{" "}
        <h2 className="font-sans text-2xl md:text-3xl font-bold mt-4">
          Page Not Found
        </h2>{" "}
        <p className="text-neutral-400 mt-2 max-w-md mx-auto">
          {" "}
          The page you&apos;re looking for doesn&apos;t exist or has been
          moved.{" "}
        </p>{" "}
        <div className="flex gap-4 justify-center mt-8">
          {" "}
          <button
            onClick={() => window.history.back()}
            className="bg-transparent text-neutral-900 font-semibold px-6 py-3 rounded-xl border-2 border-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300 active:scale-95 flex items-center gap-2"
          >
            {" "}
            <FiArrowLeft /> Go Back{" "}
          </button>{" "}
          <Link
            to="/"
            className="bg-amber-500 text-neutral-900 font-semibold px-6 py-3 rounded-xl hover:bg-amber-600 transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {" "}
            <FiHome /> Home{" "}
          </Link>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default NotFound;
