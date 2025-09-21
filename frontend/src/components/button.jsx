import { ClipLoader } from 'react-spinners';
const Button = ({ text, onSubmit, loading }) => {
  return (
    <button
      onClick={onSubmit}
      className={`w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 cursor-pointer bg-[#ff4d2d] text-white hover:bg-[#e64323]`}
      disabled={loading}
    >
      {loading && <ClipLoader size={20} color='white' />}
      {text}
    </button>
  );
};

export default Button;
