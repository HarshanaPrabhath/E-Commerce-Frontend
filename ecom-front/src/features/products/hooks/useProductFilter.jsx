import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../../../store/actions";

const useProductFilter = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const searchKey = searchParams.toString();

    useEffect(()=>{
        const currentParams = new URLSearchParams(searchKey);
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

        const queryString = params.toString();
        
        dispatch(fetchProducts(queryString))
        
    },[dispatch,searchKey])

};

export default useProductFilter;
