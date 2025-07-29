import { Pagination } from '@mui/material';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const Paginations = ({ numberOfPage, totalProducts }) => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const pathname = location.pathname;
    const params = new URLSearchParams(searchParams);
    const navigate = useNavigate();

    const currentPage = searchParams.get("page")
        ? Number(searchParams.get("page"))
        : 1;

    const onChangeHandler = (event, value) => {
        params.set("page", value.toString());
        const finalUrl = `${pathname}?${params.toString()}`;
        console.log("Navigating to:", finalUrl); // Optional: Debug line
        navigate(finalUrl);
    };

    return (
        <Pagination
            count={numberOfPage}
            page={currentPage}
            variant="outlined"
            shape="rounded"
            color="primary"
            onChange={onChangeHandler}
        />
    );
};

export default Paginations;
