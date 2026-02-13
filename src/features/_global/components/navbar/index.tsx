import { getSchoolId } from "../../hooks/getSchoolId";
import NavbarComp1378101 from "./navbarComp1370101";
import NavbarComp40 from "./navbarComp40";

const NavbarComp = () => {
    const schoolID = getSchoolId();
    return (
      <>
        {
            schoolID === '2' ? (
              <NavbarComp1378101 />
            ) : schoolID === "79" ? (
              <NavbarComp1378101 />
            ) : schoolID === "40" ? (
              <NavbarComp40 />
            ) : (
              <NavbarComp1378101 />
            )
          }
      </>
    )
  }

  export default NavbarComp;