import { getSchoolId } from "../../hooks/getSchoolId";
import SambutanComp1378101 from "./sambutanComp1378101";
import SambutanComp40 from "./sambutanComp40";

export const SambutanComp = () => {
    const schoolID = getSchoolId();
    return (
      <>
        {
            schoolID === '2' ? (
              <SambutanComp1378101 />
            ) : schoolID === "79" ? (
              <SambutanComp1378101 />
            ) : schoolID === "40" ? (
              <SambutanComp40 />
            ) : (
              <SambutanComp1378101 />
            )
          }
      </>
    )
  }