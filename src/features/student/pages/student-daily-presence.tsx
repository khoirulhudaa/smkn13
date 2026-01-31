import { useParamDecode } from "@/features/_global";
import React from "react";
export const StudentDailyPresence = React.memo(() => {
  const { decodeParams } = useParamDecode();
  return (
    <div>  
      {/* <StudentDailyPresenceTable id={Number(decodeParams?.id)} /> */}
    </div>
  );
});
