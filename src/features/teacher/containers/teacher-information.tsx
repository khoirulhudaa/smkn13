import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/libs";
import { formatGender, getStaticFile } from "@/core/utils";
import { InfoItem, ViewPhoto } from "@/features/_global";
import {
  CheckIcon,
  IdCard,
  LogInIcon,
  Mail,
  MapPin,
  PersonStanding,
  Phone,
  Table,
  TabletSmartphone,
  User,
  VerifiedIcon,
} from "lucide-react";
import { createGmapUrl, dayjs, lang } from "@/core/libs";
import { Link } from "react-router-dom";
import { useBiodataGuru, useUserDetail } from "@/features/user";
import { useMemo } from "react";

export interface TeacherInformationProps {
  id?: number;
}

export const TeacherInformation = (props: TeacherInformationProps) => {
  const teacher = useBiodataGuru();
  const userDetail = useUserDetail(Number(props.id));
  const currentTeacher = useMemo(() => {
    const d = teacher.data?.find((d) => d.userId === props.id);
    return {
      ...d,
      user: {
        ...d,
        ...userDetail?.data,
      },
    };
  }, [props.id, teacher.data, userDetail.data]);

  const detail = {
    data: currentTeacher,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div>
        <ViewPhoto
          title={detail.data?.user?.name || "-"}
          image={getStaticFile(String(detail.data?.user?.image))}
        />
      </div>
      <div className="md:col-span-2 lg:col-span-3">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{detail.data?.user?.name}</CardTitle>
            <CardDescription>{`NIP: ${detail?.data?.user?.nip || "-"}`}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <InfoItem
                icon={<User size={24} />}
                label={lang.text("fullName")}
                value={detail.data?.user?.name || "-"}
              />
              <InfoItem
                icon={<IdCard size={24} />}
                label="NIP"
                value={detail.data?.user?.nip || "-"}
              />
              <InfoItem
                icon={<IdCard size={24} />}
                label="NRK"
                value={detail.data?.user?.nrk || "-"}
              />
              <InfoItem
                icon={<Mail size={24} />}
                label="Email"
                value={detail.data?.user?.email || "-"}
              />
              <InfoItem
                icon={<Mail size={24} />}
                label={lang.text("school")}
                value={detail.data?.user?.sekolah?.namaSekolah || "-"}
              />
              <InfoItem
                icon={<Table size={24} />}
                label={lang.text("classroom")}
                value={detail.data?.kode_guru || "-"}
              />
              <InfoItem
                icon={<MapPin size={24} />}
                label={lang.text("address")}
                value={detail.data?.user?.alamat || "-"}
              />
              <InfoItem
                icon={<MapPin size={24} />}
                label={lang.text("hobby")}
                value={detail.data?.user?.hobi || "-"}
              />
              <InfoItem
                icon={<PersonStanding size={24} />}
                label={lang.text("gender")}
                value={formatGender(detail.data?.user?.jenisKelamin) || "-"}
              />
              <InfoItem
                icon={<CheckIcon size={24} />}
                label={lang.text("status")}
                value={
                  detail.data?.user?.isActive === 2
                    ? lang.text("active")
                    : lang.text("nonActive")
                }
              />
              <InfoItem
                icon={<LogInIcon size={24} />}
                label={lang.text("lastLogin")}
                value={dayjs(detail.data?.user?.lastLogin).format(
                  "HH:mm, DD MMM YYYY",
                )}
              />
              <InfoItem
                icon={<VerifiedIcon size={24} />}
                label={lang.text("verificationStatus")}
                value={
                  detail.data?.user?.isVerified
                    ? lang.text("isVerified")
                    : lang.text("isNotVerified")
                }
              />
              <InfoItem
                icon={<Phone size={24} />}
                label={lang.text("noHP")}
                value={detail.data?.user?.noTlp || "-"}
              />
              <InfoItem
                icon={<TabletSmartphone size={24} />}
                label={lang.text("deviceId")}
                value={detail.data?.user?.noTlp || "-"}
              />
              <InfoItem
                icon={<MapPin size={24} />}
                label={lang.text("lastLocation")}
                renderValue={
                  detail?.data?.location ? (
                    <Link
                      to={createGmapUrl(
                        detail.data.location?.latitude,
                        detail.data.location.longitude,
                      )}
                      target="_blank"
                    >
                      {lang.text("seeOnMap")}
                    </Link>
                  ) : (
                    "-"
                  )
                }
              />
            </div>
          </CardContent>
          {/* <CardFooter className="flex justify-between"> */}
          {/*   <Button variant="outline">Cancel</Button> */}
          {/*   <Button>Deploy</Button> */}
          {/* </CardFooter> */}
        </Card>
      </div>
    </div>
  );
};
