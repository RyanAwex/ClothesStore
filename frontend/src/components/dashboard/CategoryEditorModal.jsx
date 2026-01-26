import React from "react";
import { CATEGORIES } from "../../utils/categories";

const CategoryEditorModal = ({
  optionsOpenProductId,
  categoryEditorSelections,
  setCategoryEditorSelections,
  closeCategoryEditor,
  toggleEditorCategory,
  saveProductCategories,
  updatingCategoryId,
}) => {
  if (!optionsOpenProductId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Categories</h3>
          <button onClick={closeCategoryEditor} className="text-gray-500">
            Close
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleEditorCategory(cat)}
              className={`py-2 px-3 rounded-lg border text-sm font-medium text-left ${
                categoryEditorSelections.includes(cat)
                  ? "bg-purple-100 text-purple-800 border-purple-200"
                  : "bg-white text-gray-700 border-gray-300 hover:border-purple-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={closeCategoryEditor}
            className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => saveProductCategories(optionsOpenProductId)}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
            disabled={updatingCategoryId === optionsOpenProductId}
          >
            {updatingCategoryId === optionsOpenProductId
              ? "Saving..."
              : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryEditorModal;