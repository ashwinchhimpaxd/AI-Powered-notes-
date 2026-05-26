import { memo } from "react";

const DeleteConfirmationModal = memo(({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#121212] border border-[#262626] rounded-xl p-6 shadow-2xl w-[90%] max-w-md flex flex-col gap-4">
                <h3 className="text-white text-xl font-semibold">Delete Note</h3>
                <p className="text-[#a1a1aa] text-sm">Are you sure you want to delete this note? This action cannot be undone.</p>
                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-[#e5e5e5] bg-[#262626] hover:bg-[#3f3f46] transition-colors font-medium text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors font-medium text-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
});

DeleteConfirmationModal.displayName = "DeleteConfirmationModal";

export default DeleteConfirmationModal;
