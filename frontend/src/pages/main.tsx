import { Outlet } from 'react-router-dom';

const MainRouter = () => {
    return (
        <div>
            <div className="header">
                Header
            </div>
            <div className="content">
                <Outlet />
            </div>
            <div className="footer">
                Footer
            </div>
        </div>
    )
}

export default MainRouter;
