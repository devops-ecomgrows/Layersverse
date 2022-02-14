const Loading = () => {
  return (
    <div className="printgrows-loading flex justify-center gap-3">
      <span className="bg-gray-300 w-3 h-3 rounded-full animate-bounce"></span>
      <span
        className="bg-gray-300 w-3 h-3 rounded-full animate-bounce"
        style={{
          animationDelay: '75ms',
        }}
      ></span>
      <span
        className="bg-gray-300 w-3 h-3 rounded-full animate-bounce"
        style={{
          animationDelay: '150ms',
        }}
      ></span>
    </div>
  );
};

export default Loading;
