import { useEditor } from '@/hooks/useEditor';

export function MobileToolbar() {
  const { handleImageUpload } = useEditor();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm border-t border-white/10 p-4">
      <input
        type="file"
        onChange={onFileChange}
        accept="image/*"
        className="block w-full text-sm text-gray-400
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
      />
    </div>
  );
}
