import { NotebookIcon } from "lucide-react";
import { Link } from "react-router";

const PostsNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6 max-w-md mx-auto text-center">
      {/* Icon bubble */}
      <div className="bg-blue-50 rounded-full p-8 shadow-sm">
        <NotebookIcon className="size-10 text-blue-600" />
      </div>

      {/* Text */}
      <h3 className="text-2xl font-bold text-gray-800">No posts yet</h3>
      <p className="text-gray-500 leading-relaxed">
        Ready to express yourself? Start your journey by writing your first post
        on <span className="text-blue-600 font-semibold">BlogWay</span>.
      </p>

      {/* Button */}
      <Link
        to="/create"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition-all active:scale-[0.97]"
      >
        ✍️ Create Your First Post
      </Link>
    </div>
  );
};

export default PostsNotFound;
