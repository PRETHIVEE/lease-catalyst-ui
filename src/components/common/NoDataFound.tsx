const NoDataFound = ({ message = "No data found" }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <img
        src="/util-images/no-data.svg"
        alt="No Data Found"
        className="w-[16rem] h-[16rem]"
      />
      <p className="text-gray-500 text-center">{message}</p>
    </div>
  );
};

export default NoDataFound;
