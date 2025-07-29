import { PropagateLoader } from "react-spinners";

const Loader = ({text}) => {
  return (
    <div className="flex justify-center items-center w-full h-[450px]">
      <div className="flex flex-col items-center gap-3">
        <PropagateLoader color="#155dfc" size={12} />
        {text ? <span>{text}</span>: <span>Please wait...</span>}

      </div>
    </div>
  );
};

export default Loader;
