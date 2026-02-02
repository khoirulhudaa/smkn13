import { getSchoolId } from "../../hooks/getSchoolId"
import HeroComp101 from "./hero101";
import { HeroComp13 } from "./hero13";
import { HeroComp78101 } from "./hero78101";


interface HeroProps {
  id?: string;
  titleProps?: string;
  subTitleProps?: string;
}

export const HeroComp = ({ id, titleProps, subTitleProps }: HeroProps) => {
    const schoolID = getSchoolId();
    return (
      <>
        {
            schoolID === '2' ? (
              <HeroComp78101 id={id} titleProps={titleProps} subTitleProps={subTitleProps} />
            ) : schoolID === "79" ? (
              <HeroComp101 id={id} titleProps={titleProps} subTitleProps={subTitleProps} />
            ) : (
              <HeroComp13 id={id} titleProps={titleProps} subTitleProps={subTitleProps} />
            )
          }
      </>
    )
  }