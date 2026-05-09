import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const useProductFilter = () => {
    const [searchParams] = useSearchParams();

    return useMemo(() => {
        const currentParams = new URLSearchParams(searchParams.toString());
        const params = new URLSearchParams();

        const requestedPage = currentParams.get("page")
              ? Number(currentParams.get("page"))
              : 1;
        const currentPage =
          Number.isFinite(requestedPage) && requestedPage > 0
            ? requestedPage
            : 1;
        params.set("pageNumber",currentPage - 1);

        const sortOrder = currentParams.get("sortby") || "asc";
        const categoryParams = currentParams.get("category") || null;
        const keyword = currentParams.get("keyword") || null;
        
        params.set("pageSize", "2");
        params.set("sortBy","productName");
        params.set("sortOrder",sortOrder);

        if(categoryParams){
            params.set("category", categoryParams);
        }
        if(keyword){
            params.set("keyword",keyword);
        }

        return params.toString();
    }, [searchParams]);

};

export default useProductFilter;
