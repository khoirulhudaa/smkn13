  import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, distinctObjectsByProperty, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, lang, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/libs";
  import { getStaticFile } from "@/core/utils";
  import { BaseDataTable } from "@/features/_global";
  import { useAlert } from "@/features/_global/hooks";
  import { useProfile } from "@/features/profile";
  import { useSchool } from "@/features/schools";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { Download, Plus, UploadCloud } from "lucide-react";
  import { Document, Image, Page, pdf, StyleSheet, Text, View } from "@react-pdf/renderer";
  import { useMemo, useState } from "react";
  import { useForm } from "react-hook-form";
  import * as XLSX from "xlsx";
  import { z } from "zod";
  import { ModalCreateClass } from "../components";
  import { useClassroom, useClassroomCreation } from "../hooks";
  import { classroomColumns, classroomDataFallback } from "../utils";
  import { FaFile, FaFileExcel, FaFilePdf } from "react-icons/fa";

  // PDF Styles
  const pdfStyles = StyleSheet.create({
    page: {
      fontSize: 12,
      fontFamily: 'Times-Roman',
    },
    header: {
      position: 'relative',
      top: 0,
      left: 0,
      right: 0,
      marginBottom: 20,
    },
    headerImage: {
      width: 595,
      maxHeight: 150,
      objectFit: 'contain',
    },
    contentWrapper: {
      paddingLeft: 32,
      paddingRight: 32,
      marginTop: 10,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 5,
      textTransform: 'uppercase',
    },
    content: {
      marginBottom: 10,
      textAlign: 'center',
      lineHeight: 1.5,
    },
    table: {
      display: 'flex',
      flexDirection: 'column',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#000',
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#000',
    },
    tableCell: {
      padding: 5,
      borderRightWidth: 1,
      borderRightColor: '#000',
      textAlign: 'center',
    },
    tableHeader: {
      fontWeight: 'bold',
      backgroundColor: '#f0f0f0',
    },
    signature: {
      marginTop: 50,
      alignItems: 'flex-end',
    },
    signatureImage: {
      width: 120,
      height: 'auto',
      maxHeight: 50,
      marginTop: 20,
      marginBottom: 10,
    },
    signatureText: {
      textAlign: 'center',
    },
  });

  // PDF Component for Classroom Data
  const ClassroomPDF: React.FC<{
    classroomData: any[];
    schoolData: { kopSurat: string | undefined; namaSekolah: string; namaKepalaSekolah: string; ttdKepalaSekolah: string | undefined };
  }> = ({ classroomData, schoolData }) => {
    const kopSuratUrl = schoolData.kopSurat
      ? schoolData.kopSurat.startsWith('data:image')
        ? schoolData.kopSurat
        : `data:image/png;base64,${schoolData.kopSurat}`
      : '';

    const signatureUrl = schoolData.ttdKepalaSekolah
      ? schoolData.ttdKepalaSekolah.startsWith('data:image')
        ? schoolData.ttdKepalaSekolah
        : `data:image/png;base64,${schoolData.ttdKepalaSekolah}`
      : '';

    const rowsPerPage = 23;
    const dataChunks = [];
    for (let i = 0; i < classroomData.length; i += rowsPerPage) {
      const chunk = classroomData.slice(i, i + rowsPerPage);
      if (chunk.length > 0) {
        dataChunks.push(chunk);
      }
    }

    return (
      <Document>
        {dataChunks.map((chunk, pageIndex) => (
          <Page
            key={pageIndex}
            size="A4"
            style={pdfStyles.page}
            break={pageIndex > 0}
          >
            <View style={pdfStyles.header} fixed>
              {kopSuratUrl && (
                <Image src={getStaticFile(kopSuratUrl)} style={pdfStyles.headerImage} />
              )}
            </View>
            <View style={pdfStyles.contentWrapper}>
              <Text style={pdfStyles.title}>Daftar Kelas</Text>
              <Text style={pdfStyles.content}>Sekolah: {schoolData.namaSekolah || 'N/A'}</Text>
              <View style={pdfStyles.table}>
                <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]} fixed>
                  {['No', 'Nama Kelas', 'Level', 'Sekolah'].map((header, index) => (
                    <View
                      key={index}
                      style={[
                        pdfStyles.tableCell,
                        pdfStyles.tableHeader,
                        {
                          width: index === 0 ? '10%' : index === 1 ? '40%' : index === 2 ? '25%' : '25%',
                        },
                      ]}
                    >
                      <Text>{header}</Text>
                    </View>
                  ))}
                </View>
                {chunk.map((item, index) => (
                  <View style={pdfStyles.tableRow} key={index} wrap={false}>
                    <View style={[pdfStyles.tableCell, { width: '10%' }]}>
                      <Text>{pageIndex * rowsPerPage + index + 1}</Text>
                    </View>
                    <View style={[pdfStyles.tableCell, { width: '40%' }]}>
                      <Text>{item.namaKelas || '-'}</Text>
                    </View>
                    <View style={[pdfStyles.tableCell, { width: '25%' }]}>
                      <Text>{item.level || '-'}</Text>
                    </View>
                    <View style={[pdfStyles.tableCell, { width: '25%' }]}>
                      <Text>{schoolData.namaSekolah || '-'}</Text>
                    </View>
                  </View>
                ))}
              </View>
              {pageIndex === dataChunks.length - 1 && (
                <View style={pdfStyles.signature}>
                  <Text style={pdfStyles.signatureText}>Kepala Sekolah,</Text>
                  {signatureUrl && (
                    <Image src={signatureUrl} style={pdfStyles.signatureImage} />
                  )}
                  <Text style={pdfStyles.signatureText}>{schoolData.namaKepalaSekolah || 'Nama Kepala Sekolah'}</Text>
                </View>
              )}
            </View>
          </Page>
        ))}
      </Document>
    );
  };

  // Function to generate PDF
  const generateClassroomPDF = async ({
    classroomData,
    alert,
    schoolData,
    schoolIsLoading,
  }: {
    classroomData: any[];
    alert: { success: (msg: string) => void; error: (msg: string) => void } | undefined;
    schoolData: any;
    schoolIsLoading: boolean;
  }) => {
    if (!alert) {
      console.error('Alert system is not available');
      return;
    }

    if (schoolIsLoading) {
      alert.error('Data sekolah masih dimuat, silakan coba lagi.');
      return;
    }

    if (!classroomData || !Array.isArray(classroomData) || classroomData.length === 0) {
      alert.error('Tidak ada data kelas untuk dihasilkan.');
      return;
    }

    if (!schoolData || !schoolData.namaSekolah) {
      alert.error('Data sekolah tidak lengkap.');
      return;
    }

    if (!schoolData.kopSurat) {
      alert.error('Kop surat tidak tersedia, laporan akan dibuat tanpa kop surat.');
    }

    try {
      const doc = (
        <ClassroomPDF
          classroomData={classroomData}
          schoolData={{
            namaSekolah: schoolData.namaSekolah || 'Nama Sekolah',
            kopSurat: schoolData.kopSurat || undefined,
            namaKepalaSekolah: schoolData.namaKepalaSekolah || 'Nama Kepala Sekolah',
            ttdKepalaSekolah: schoolData.ttdKepalaSekolah || undefined,
          }}
        />
      );

      const pdfInstance = pdf(doc);
      const pdfBlob = await pdfInstance.toBlob();

      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Daftar-Kelas-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert.success('Daftar kelas berhasil diunduh sebagai PDF.');
    } catch (error) {
      console.error('Error generating classroom PDF:', error);
      alert.error('Gagal menghasilkan daftar kelas dalam format PDF.');
    }
  };

  export const ClassroomTable = () => {
    const resource = useClassroom();
    const school = useSchool();
    const profile = useProfile();
    const creation = useClassroomCreation();
    const alert = useAlert();
    const [classRoom, setCreateClassRoom] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [exportLoading, setExportLoading] = useState<{ excel: boolean; pdf: boolean }>({ excel: false, pdf: false });
    const [selectedExport, setSelectedExport] = useState<string>("");
    const [searchNamaKelas, setSearchNamaKelas] = useState("");

    console.log('classRoom:', resource);
    console.log('school:', school);
    console.log('profile:', profile);

    const columns = useMemo(
      () =>
        classroomColumns({
          schoolOptions: distinctObjectsByProperty(
            school.data?.map((d) => ({
              label: d.namaSekolah,
              value: d.namaSekolah,
            })) || [],
            "value",
          ),
        }),
      [school.data],
    );

    // Filter data based on namaKelas search
    const filteredData = useMemo(() => {
      if (!searchNamaKelas) return resource.data;
      return resource.data?.filter((item) =>
        item.namaKelas?.toLowerCase().includes(searchNamaKelas.toLowerCase())
      ) || [];
    }, [resource.data, searchNamaKelas]);

    // Schema for file upload form
    const uploadSchema = z.object({
      file: z
        .instanceof(File)
        .refine((file) => file && [".xlsx", ".xls"].some(ext => file.name.toLowerCase().endsWith(ext)), {
          message: lang.text("invalidFileType"),
        }),
    });

    const uploadForm = useForm<z.infer<typeof uploadSchema>>({
      resolver: zodResolver(uploadSchema),
      defaultValues: {
        file: undefined,
      },
    });

    // Function to download existing Excel template
    const handleDownloadTemplate = () => {
      const link = document.createElement("a");
      link.href = "/template_kelas.xlsx";
      link.download = "template_kelas.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    // Function to export data to Excel
    const handleExportExcel = () => {
      if (!filteredData || filteredData.length === 0) {
        alert.error("Tidak ada data untuk diekspor.");
        return;
      }

      setExportLoading((prev) => ({ ...prev, excel: true }));

      const exportData = filteredData.map((item, index) => ({
        No: index + 1,
        namaKelas: item.namaKelas,
        Level: item.level,
        Sekolah: school.data?.[0]?.namaSekolah || 'N/A',
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Classrooms");

      // Auto-size columns
      const colWidths = [
        { wch: 5 },  // No
        { wch: 20 }, // namaKelas
        { wch: 15 }, // Level
        { wch: 20 }, // Sekolah
      ];
      worksheet['!cols'] = colWidths;

      XLSX.writeFile(workbook, `classroom_data_${new Date().toISOString().slice(0, 10)}.xlsx`);
      alert.success("Data berhasil diekspor ke Excel.");
      setExportLoading((prev) => ({ ...prev, excel: false }));
      setSelectedExport(""); // Reset dropdown
    };

    // Function to export data to PDF
    const handleExportPDF = async () => {
      if (!filteredData || filteredData.length === 0) {
        alert.error("Tidak ada data untuk diekspor.");
        return;
      }

      setExportLoading((prev) => ({ ...prev, pdf: true }));

      await generateClassroomPDF({
        classroomData: filteredData,
        alert,
        schoolData: school.data?.[0] || {},
        schoolIsLoading: school.isLoading,
      });

      setExportLoading((prev) => ({ ...prev, pdf: false }));
      setSelectedExport(""); // Reset dropdown
    };

    // Function to handle export selection
    const handleExport = (format: string) => {
      if (format === "excel") {
        handleExportExcel();
      } else if (format === "pdf") {
        handleExportPDF();
      }
    };

    // Function to handle Excel file upload
    const handleUploadExcel = async (data: z.infer<typeof uploadSchema>) => {
      const file = data.file;
      if (!file) return;

      if (!profile?.user?.sekolahId) {
        alert.error("Gagal mendapatkan sekolahId dari profil pengguna.");
        return;
      }

      setUploading(true);
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(sheet) as {
            No?: number | string;
            namaKelas: string;
            Level: string;
          }[];

          // Validate and process each row
          for (const row of jsonData) {
            try {
              const formattedData = {
                namaKelas: row.namaKelas?.toString().trim(),
                level: row.Level?.toString().trim(),
                sekolahId: profile?.user?.sekolahId,
              };

              console.log("format", formattedData);

              // Create classroom
              await creation.create(formattedData);
              alert.success(`Kelas "${row.namaKelas}" berhasil dibuat.`);
              await resource.query.refetch();
            } catch (err: any) {
              alert.error(`Gagal membuat kelas "${row.namaKelas}": ${err?.message || "Kesalahan tidak diketahui"}`);
            }
          }

          // Refetch data after all creations
          await resource.query.refetch();
          alert.success("Pembuatan kelas secara massal selesai.");
        };
        reader.readAsArrayBuffer(file);
      } catch (err: any) {
        alert.error(`Gagal memproses file Excel: ${err?.message || "Kesalahan tidak diketahui"}`);
      } finally {
        setUploading(false);
        uploadForm.reset();
        setUploadModalOpen(false);
      }
    };

    return (
      <>
        <ModalCreateClass show={classRoom} onClose={() => setCreateClassRoom(!classRoom)} />
        <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
          <DialogContent className="w-[600px] pt-10 h-max">
            <DialogHeader className="flex h-[54px] justify-between border-b border-b-white/10 pb-6 mb-4">
              <DialogTitle className="flex items-baseline">
                <p>{lang.text('uploadExcel')}</p>
              </DialogTitle>
            </DialogHeader>
            <Form {...uploadForm}>
              <form onSubmit={uploadForm.handleSubmit(handleUploadExcel)} className="mb-8">
                <div className="flex flex-col gap-6">
                  <FormField
                    control={uploadForm.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{lang.text('selectFileExcel')}</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={(e) => field.onChange(e.target.files?.[0])}
                          />
                        </FormControl>
                        <FormMessage>{uploadForm.formState.errors.file?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={uploading || !profile?.user?.sekolahId}
                      className="active:scale-[0.97]"
                    >
                      {uploading ? lang.text('progress') : lang.text('uploadExcelClass')}
                      <UploadCloud />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setUploadModalOpen(false)}
                      className="active:scale-[0.97]"
                    >
                      {lang.text("cancel")}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <div className="flex gap-4 mb-4 items-center">
          <Button
            variant={'outline'}
            disabled={uploading || exportLoading.excel || exportLoading.pdf || !profile?.user?.sekolahId}
            className="active:scale-[0.97]"
            onClick={() => setCreateClassRoom(true)}
          >
            {lang.text('CreateClass')}
            <Plus />
          </Button>
          <div>
            <p>{lang.text('or')}</p>
          </div>
          <Button
            onClick={handleDownloadTemplate}
            disabled={uploading || exportLoading.excel || exportLoading.pdf}
            className="hover:bg-black/10 hover:text-green-300 active:scale-[0.99] bg-transparent border border-green-500 text-green-200"
          >
            {lang.text('DownloadTemplateExcel')}
            <Download />
          </Button>
          <div className="w-[1px] bg-white/20 mx-1 h-[76%]"></div>
          <Button
            variant={'outline'}
            onClick={() => setUploadModalOpen(true)}
            disabled={uploading || exportLoading.excel || exportLoading.pdf || !profile?.user?.sekolahId}
            className="active:scale-[0.97]"
          >
            {uploading ? lang.text('progress') : lang.text("uploadExcel")}
          <UploadCloud />
          </Button>
          <Select
            value={selectedExport}
            onValueChange={handleExport}
            disabled={uploading || exportLoading.excel || exportLoading.pdf || !filteredData?.length}
          >
          <SelectTrigger className="w-[120px] ml-auto">
            <SelectValue
              placeholder={
                <span className="flex items-center gap-2">
                  <FaFile />
                  {lang.text('export')}
                </span>
              }
            />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excel">
                <p className="flex items-center">
                  <FaFileExcel className="mr-2" />
                  Export excel 
                </p>
              </SelectItem>
              <SelectItem className="flex items-center w-max" value="pdf">
                <p className="flex justify-between items-center">
                  <FaFilePdf className="mr-2" />
                  Export PDF 
                </p>
              </SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder={lang.text('searchClass')}
            value={searchNamaKelas}
            onChange={(e) => setSearchNamaKelas(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <BaseDataTable
          columns={columns}
          data={filteredData}
          dataFallback={classroomDataFallback}
          globalSearch={false}
          actions={[
            {
              title: lang.text("addClassroom"),
              onClick: () => setCreateClassRoom(!classRoom),
            },
          ]}
          searchParamPagination
          isLoading={resource.query.isLoading}
        />
      </>
    );
  };