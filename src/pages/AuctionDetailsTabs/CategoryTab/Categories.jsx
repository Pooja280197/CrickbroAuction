import React, { useEffect, useState } from "react";
import CreateCategory from "./createCategory";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategories,
} from "../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";
import CategoryPlayers from "./CategoryPlayers";

const Categories = ({ auctionId }) => {
  const [categoryPopup, setCategoryPopup] = useState(false);
  // const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editId, setEditId] = useState("");
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [categoryId,setCategoryId]=useState("")
  const [playersPopup,setPlayersPopup]=useState(false)
  const categoryLoading = useSelector((state) => state?.loading?.categories);
  const categoryDetails = useSelector((state) => state?.data?.categories);
  const categories = categoryDetails?.data;
  const dispatch = useDispatch();

  const tournamentId = localStorage.getItem("tournamentId");

  useEffect(() => {
    dispatch(getCategories(auctionId));
  }, [auctionId]);

  const handleCreateCategory = async (categoryData) => {
    const data = {
      ...categoryData,
      auctionId,
      tournamentId,
    };
    try {
      await dispatch(createCategory(data));
      toast.success("Category created successfully");
      dispatch(getCategories(auctionId));
      // optionally refresh sessions list here
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }

    setCategoryPopup(false);
  };

  const handleUpdateCategory = async (categoryData) => {
    const data = {
      ...categoryData,
      auctionId,
      tournamentId,
    };
    try {
      await dispatch(updateCategories(data, editId));
      toast.success("Category updated successfully");
      dispatch(getCategories(auctionId));
      // optionally refresh sessions list here
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }

    setCategoryPopup(false);
    setCategoryPopup(false);
    setEditingCategory(null);
  };

  const handleEditCategory = (category) => {
    setEditId(category._id);
    setEditingCategory(category);
    setCategoryPopup(true);
  };

  const handleDeleteCategory = async() => {
    try {
     await dispatch(deleteCategory(deleteId));
     toast.success("Category deleted successfully")
      setDeletePopup(false);
      dispatch(getCategories(auctionId));
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="text-gray-100 min-h-screen p-6">
      <div className="flex items-center justify-between mb-6 max-w-6xl mx-auto">
        <h4 className="text-xl font-semibold text-white">Categories</h4>
        <button
          onClick={() => {
            setEditingCategory(null);
            setCategoryPopup(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-cyan-500/20"
        >
          Create Category
        </button>
      </div>

      {/* Categories Table */}
      {categories?.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800 max-w-6xl mx-auto">
          <div className="text-gray-400 mb-2">No categories available</div>
          <div className="text-sm text-gray-500">
            Create your first category to get started
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/30 backdrop-blur-sm max-w-6xl mx-auto">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-900 to-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider border-b border-gray-800">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider border-b border-gray-800">
                    Base Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider border-b border-gray-800">
                    Bid Increment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider border-b border-gray-800">
                    Max Bid
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider border-b border-gray-800">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {categories?.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4">{category.name}</td>
                    <td className="px-6 py-4">₹{category.baseAmount}</td>
                    <td className="px-6 py-4">₹{category.biddingIncrement}</td>
                    <td className="px-6 py-4">₹{category.maxBid}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="px-3 py-1 text-xs bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setDeletePopup(true);
                            setDeleteId(category._id);
                          }}
                          className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                        >
                          Delete
                        </button>
                         <button
                          onClick={() => {
                            setPlayersPopup(true);
                            setCategoryId(category._id);
                          }}
                          className="px-3 py-1 text-xs bg-green-500/20 text-white-400 rounded hover:bg-green-500/30"
                        >
                          View Players
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CreateCategory
        isOpen={categoryPopup}
        onClose={() => {
          setCategoryPopup(false);
          setEditingCategory(null);
        }}
        onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
        initialData={editingCategory}
      />
      <DeleteConfirmModal
        open={deletePopup}
        title="Delete Category"
        description="Do you want to delete this category ?"
        onClose={() => setDeletePopup(false)}
        onConfirm={handleDeleteCategory}
      />
       <CategoryPlayers
        open={playersPopup}
        onClose={()=> setPlayersPopup(false)}
        // onConfirm={handleDeleteCategory}
        categoryId={categoryId}
        auctionId={auctionId}
      />
    </div>
  );
};

export default Categories;
