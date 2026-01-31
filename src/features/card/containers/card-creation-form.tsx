import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  lang,
} from "@/core/libs";
import { useAlert } from "@/features/_global/hooks";
import { useProfile } from "@/features/profile";
import { useSchool } from "@/features/schools";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { SaveIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

// Updated Zod schema
const cardUpdateFormSchema = z.object({
  namaSekolah: z.string().min(1, "Nama sekolah wajib diisi"),
  alamatSekolah: z.string().min(1, "Alamat sekolah wajib diisi"),
  visiMisi: z.string().min(1, "Visi & Misi wajib diisi"),
});

// Custom CSS for transparent CKEditor background with black text
const editorStyles = `
  .ck-editor__main .ck-content {
    background: transparent !important;
    color: white !important;
    border: 1px solid #4B5EAA; /* Optional: Maintain border for visibility */
    height: max-content;
    padding-bottom: 10px;
  }
`;

export const CardCreationForm = () => {
  const profile = useProfile();
  const school = useSchool();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const alert = useAlert();

  console.log('school letter', school);

  const form = useForm<z.infer<typeof cardUpdateFormSchema>>({
    resolver: zodResolver(cardUpdateFormSchema),
    mode: "onBlur",
    defaultValues: {
      namaSekolah: school.data?.[0]?.namaSekolah || "",
      alamatSekolah: school.data?.[0]?.alamatSekolah || "",
      visiMisi: school.data?.[0]?.visiMisi || "",
    },
  });

  async function onSubmit(data: z.infer<typeof cardUpdateFormSchema>) {
    setIsLoading(true);
    try {
      const formData = new FormData();
      const token = localStorage.getItem("token");

      if (data.namaSekolah && data.namaSekolah !== school.data?.[0]?.namaSekolah) {
        formData.append("namaSekolah", data.namaSekolah);
      }

      if (data.alamatSekolah && data.alamatSekolah !== school.data?.[0]?.alamatSekolah) {
        formData.append("alamatSekolah", data.alamatSekolah);
      }

      if (data.visiMisi && data.visiMisi !== school.data?.[0]?.visiMisi) {
        formData.append("visiMisi", data.visiMisi);
      }

      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: token ? `Bearer ${token}` : "",
        withCredentials: true,
      };

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/sekolah/${profile?.user?.sekolahId}`,
        formData,
        { headers }
      );

      alert.success("Data kartu berhasil diperbarui");
      school.query.refetch();
      navigate("/format/card", { replace: true });
    } catch (err: any) {
      console.error("Error saat submit:", err);
      if (err.response) {
        alert.error(err.response.data?.message || "Gagal memperbarui data kartu");
      } else if (err.request) {
        alert.error("Gagal memperbarui data kartu");
      } else {
        alert.error(err?.message || "Gagal memperbarui data kartu");
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (school?.query.error) {
    alert.error("Gagal memuat data");
    navigate("/letters");
    return null;
  }

  if (school.isLoading) {
    return <div>{lang.text('loading')}</div>;
  }

  return (
    <div className="flex flex-col gap-8 py-6 mb-4">
      <style>{editorStyles}</style>
        <div className="w-full flex rounded-lg items-center justify-between p-8 bg-white/20">
        <div id={`student-card-Filmsy`}>
          <div
            className={`front-card ${'horizontal'}`}
            style={{
              backgroundImage: `url(${'/src/features/kartuSiswa/assets/bg1.png'})`,
              width: "500px",
              height: "300px",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className={`header ${'horizontal'}`}>
              <div className="school-info">
                <h2 className="school-name">{school.data?.[0]?.namaSekolah || "SMKN 111 Example"}</h2>
                <p className="school-address">{school.data?.[0]?.alamatSekolah || "Jl. Example Nomor 12122"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[1px] h-full bg-white/20">
        </div>

        <div
          id={`student-card-1-back`}
          className={`w-full back-card ${'horizontal'}`}
          style={{ backgroundImage: `url(${'/src/features/kartuSiswa/assets/bg1.png'})` }}
        >
          <div className="back-card-content">
            <h2 className="back-title">{school.data?.[0]?.namaSekolah || "Sekolah Indonesia"}</h2>
            <div
              className={`bg-white p-4 rounded-lg text-[13px] text-black visi-misi ${'horizontal'}`}
              dangerouslySetInnerHTML={{ __html: school.data?.[0]?.visiMisi || "Visi dan Misi tidak tersedia" }}
            />
            <div className={`qr-logo-section ${'horizontal'}`}>
              <div className="qr-container">
                <QRCode
                  value={1234567891}
                  size={120}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[100%]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <div className="w-full flex gap-4">
                <div className="basis-1 sm:basis-1/2">
                  <FormField
                    control={form.control}
                    name="namaSekolah"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{lang.text('schoolName')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={lang.text('inputSchoolName')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="basis-1 sm:basis-1/2">
                  <FormField
                    control={form.control}
                    name="alamatSekolah"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{lang.text('address')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={lang.text('inputaddress')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
               <div className="flex flex-col gap-6 w-full">
                <div>
                  <div className="flex flex-col gap-4">
                    <FormField
                      control={form.control}
                      name="visiMisi"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Visi & Misi</FormLabel>
                          <FormControl>
                            <CKEditor
                              editor={ClassicEditor}
                              data={field.value}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                field.onChange(data);
                              }}
                              config={{
                                placeholder: lang.text('inputVisiMisi'),
                                toolbar: [
                                  'heading', '|',
                                  'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                                  'undo', 'redo'
                                ],
                              }}
                            />
                          </FormControl>
                          <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="py-4 flex gap-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full py-6 active:scale-[0.97]"
                >
                  {isLoading ? <FaSpinner className="animate animate-spin duration-600" /> : lang.text('save')}
                  <SaveIcon />
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};