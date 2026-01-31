import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useState } from "react";

/* ================================
           TIPE DATA
================================ */
type Organization = {
  id: number;
  position: string;
  description?: string;
  assignedEmployeeId?: number | null;
  GuruTendik?: {
    id: number;
    nama: string;
    photoUrl: string | null;
  };
  parentId: number | null;
  Children?: Organization[];
  createdAt?: string;
  updatedAt?: string;
  schoolId?: number;
  isActive?: boolean;
};

/* ================================
      KOMPONEN REKURSIF NODE
================================ */
const OrgNode = ({ node, level = 0 }: { node: Organization; level?: number }) => {
  const hasChildren = !!node.Children && node.Children.length > 0;

  return (
    <div className="flex flex-col items-center relative transition-all duration-300">
      {/* Garis Vertikal Atas */}
      {level > 0 && <div className="w-px h-6 bg-gray-300"></div>}

      {/* Kartu Pengurus */}
      <div className="relative group mx-0.5 sm:mx-2">
        <div 
          className="w-max px-4 bg-white rounded-lg shadow-sm overflow-hidden border transition-all hover:shadow-md"
          style={{ 
            borderColor: level === 0 ? '#16a34a' : (level === 1 ? '#2563eb' : '#94a3b8'),
            borderWidth: '1.5px'
          }}
        >
          {/* Posisi */}
          <div 
            className="py-0.5 px-1 text-[7px] sm:text-[9px] font-bold text-white text-center uppercase truncate"
            style={{ backgroundColor: level === 0 ? '#16a34a' : (level === 1 ? '#2563eb' : '#64748b') }}
          >
            {node.position}
          </div>

          <div className="p-1.5 sm:p-2 flex flex-col items-center">
            {/* Foto */}
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border border-black/60 overflow-hidden mb-1 bg-white flex items-center justify-center flex-shrink-0">
              <img 
                src={node.GuruTendik?.photoUrl ? `${node.GuruTendik.photoUrl}` : "/default.jpg"} 
                className="w-full h-full object-cover"
                alt=""
                onError={(e) => (e.currentTarget.src = "/placeholder-user.jpg")}
              />
              {/* <User className="text-black" /> */}
            </div>

            {/* Nama */}
            <div className="text-[8px] sm:text-[11px] font-bold text-gray-800 text-center leading-tight line-clamp-2 h-6 sm:h-8 flex items-center justify-center">
              {node.GuruTendik?.nama || "-"}
            </div>
          </div>
        </div>
      </div>

      {/* Garis & Children */}
      {hasChildren && (
        <div className="flex flex-col items-center w-full">
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="flex justify-center relative w-full">
            {node.Children!.length > 1 && (
              <div className="absolute top-0 left-0 right-0 flex justify-center">
                <div 
                  className="border-t border-gray-300" 
                  style={{ 
                    width: `calc(100% - ${100 / node.Children!.length}%)`,
                  }}
                ></div>
              </div>
            )}
            <div className="flex gap-1 sm:gap-2">
              {node.Children!.map((child) => (
                <OrgNode key={child.id} node={child} level={level + 1} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================================
       KOMPONEN UTAMA - TREE VIEW
================================ */
const SCHOOL_ID = getSchoolId();

const StrukturOrganisasi = () => {
  const [treeData, setTreeData] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://be-school.kiraproject.id/organisasi?schoolId=${SCHOOL_ID}`);
        const json = await res.json();
        if (json.success) setTreeData(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fungsi sederhana untuk mengontrol zoom manual jika diinginkan
  const handleZoom = (type: 'in' | 'out' | 'reset') => {
    if (type === 'in') setZoom(prev => Math.min(prev + 0.1, 1.5));
    if (type === 'out') setZoom(prev => Math.max(prev - 0.1, 0.4));
    if (type === 'reset') setZoom(1);
  };

  return (
    <section id="org" className="no-select pb-16 pt-10 bg-gray-50 min-h-screen relative overflow-hidden">
      <div className="max-w-[100vw] mx-auto px-4">
        <div className="text-center mb-8">
          {/* Kontrol Zoom - Membantu navigasi struktur besar */}
          <div className="mt-4 flex justify-center gap-2 no-print">
            <button onClick={() => handleZoom('out')} className="flex items-center gap-2 py-2 bg-white text-black px-3 border border-black/40 shadow rounded-md hover:bg-gray-100 text-xs font-bold">
              <ZoomIn size={16} />
              Zoom Out (-
              )</button>
            <button onClick={() => handleZoom('reset')} className="flex items-center gap-2 py-2 bg-white text-black px-3 border border-black/40 shadow rounded-md hover:bg-gray-100 text-xs font-bold">
              <ReloadIcon width={14} />
              Reset
            </button>
            <button onClick={() => handleZoom('in')} className="flex items-center gap-2 py-2 bg-white text-black px-3 border border-black/40 shadow rounded-md hover:bg-gray-100 text-xs font-bold">
              <ZoomOut size={16} />
              Zoom In (+)
              </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">Memuat Struktur...</div>
        ) : treeData.length === 0  ? (
            <div className="w-full bg-gray-400/5 rounded-lg text-gray-400 h-[200px] flex items-center justify-center">
                <p>Belum ada anggota organisasi</p>
            </div>
        ) : (
          /* Area Scroll dengan Dynamic Scale */
          <div className="overflow-auto border border-gray-200 rounded-3xl bg-white shadow-inner p-8 md:p-12 min-h-[600px]">
            <div 
              className="org-tree-container"
              style={{ 
                transform: `scale(${zoom})`,
                width: 'max-content',
                margin: '0 auto'
              }}
            >
              <div className="flex flex-col items-center">
                {treeData.map((root) => (
                  <OrgNode key={root.id} node={root} level={0} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

/* ================================
           HALAMAN UTAMA
================================ */
const Page = ({ theme }: { theme: any; }) => (
  <div className="min-h-screen" style={{ background: theme.bg }}>
    <NavbarComp theme={theme} />
    <HeroComp titleProps="Struktur Organisasi" id="#org" />
    <main>
      <StrukturOrganisasi />
    </main>
    <FooterComp />
  </div>
);

const StrukturPage = () => {
  const { theme } = SMAN25_CONFIG;
  return <Page theme={theme} />;
};

export default StrukturPage;