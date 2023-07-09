const FooterMain = ({ which_api }) => {
    return (
        <div className="footer-bs mt-auto bg-dark text-white" id="footer">
            <div className="container p-3">
                <div className="row">
                    <div className='col-xs-12 col-sm-8 align-items-left'>
                        <h5>Algorand GMI</h5>
                    </div>
                    <div className='col-xs-12 col-sm-4 d-flex align-items-center '>
                        <h5 className="pt-2 me-3">Find me @</h5>
                        <a className="mx-2" href="https://www.linkedin.com/in/kunal-mahajan-8592a3212" target="_blank" rel="noreferrer">
                            <i className="bi bi-linkedin  text-white" style={{ fontSize: 25 }}></i>
                        </a>
                        <a className="mx-2" href="mailto:destinier.kunal34@gmail.com">
                            <i className="bi bi-envelope  text-white" style={{ fontSize: 25 }}></i>
                        </a>
                        <a className="mx-2" href="https://github.com/sudo-Kunal-Mahajan" target="_blank" rel="noreferrer">
                            <i className="bi bi-github  text-white" style={{ fontSize: 25 }}></i>
                        </a>
                    </div>
                </div>
            </div>
            <div className="text-center p-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                Powered By {which_api}
            </div>
        </div>
    )
}

export default FooterMain;
