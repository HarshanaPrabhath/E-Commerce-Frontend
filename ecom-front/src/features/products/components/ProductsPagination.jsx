import Paginations from "../../../shared/components/Paginations";

function ProductsPagination({ totalPages }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center pt-10 pb-20 border-t border-slate-100">
      <Paginations numberOfPage={totalPages} />
    </div>
  );
}

export default ProductsPagination;
