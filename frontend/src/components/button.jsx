const Button = ({ text, onSubmit }) => {
  return (
    <button
      onClick={onSubmit}
      className={`w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 cursor-pointer bg-[#ff4d2d] text-white hover:bg-[#e64323]`}
    >
      {text}
    </button>
  );
};

export default Button;
