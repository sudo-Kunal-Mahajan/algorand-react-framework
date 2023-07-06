import GenerateNewAddress from "./Generate_new_address"

const NavMain = ({ address, handleAddressUpdate }) => {

    const LogoutUser = () => {
        handleAddressUpdate(null)
    }
    return (
        <section id="navbar_main_section">
            <nav className="navbar navbar-expand-md sticky-top p-3 " role="navigation">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#"><h5 className=" mt-0 mb-0">REACT COMPONENT</h5></a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">

                        <ul className="navbar-nav  ms-auto">
                            {
                                address && (
                                    <li className="nav-item dropdown ">
                                        <a className="nav-link dropdown-toggle" href="#" id="navbar_profile_link" role="button"
                                            data-bs-toggle="dropdown" aria-expanded="false">
                                            <img src='/profile.png' width="20" alt="profile" />
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-end" style={{ right: 0 }} aria-labelledby="navbar_profile_link">
                                            <li>
                                                <GenerateNewAddress address={address} handleAddressUpdate={handleAddressUpdate} />
                                            </li>
                                            <li>
                                                <hr className="dropdown-divider" />
                                            </li>
                                            <li>
                                                <button className="dropdown-item" onClick={LogoutUser}>Log out</button>
                                            </li>
                                        </ul>
                                    </li>
                                )
                            }
                            {!address && (
                                <>
                                <li className="nav-item ">
                                <GenerateNewAddress address={address} handleAddressUpdate={handleAddressUpdate} />
                                </li>
                                
                                </>
                                
                            )}
                        </ul>



                    </div>
                </div>
            </nav>
        </section>
    )
}

export default NavMain;