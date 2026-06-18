import { memo } from "react";

const DeleteConfirmationModal = memo(({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-xl p-6 shadow-2xl w-[90%] max-w-md flex flex-col gap-4">
                <h3 className="text-foreground text-xl font-semibold">Delete Note</h3>
                <p className="text-muted-foreground text-sm">Are you sure you want to delete this note? This action cannot be undone.</p>
                <div className="flex justify-end gap-3 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-foreground bg-muted hover:bg-border/60 transition-colors font-medium text-sm cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors font-medium text-sm cursor-pointer"
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
