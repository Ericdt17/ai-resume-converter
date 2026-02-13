import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import resume from "./resume";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CVmind" },
    { name: "description", content: "Postulez plus intelligemment avec l’IA!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/auth?next=/");
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      const resumes = (await kv.list("resume:*", true)) as KVItem[];
      const parsedResumes = resumes.map(
        (resume) => JSON.parse(resume.value) as Resume,
      );
      console.log(parsedResumes);
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };
    loadResumes();
  }, []);
  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(resume.imagePath);
      if (!blob) return;
      let url = URL.createObjectURL(blob);
      setResumeUrl(url);
    };
    loadResume();
  }, [resume.imagePath]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Mesurez la performance de votre CV et améliorez vos chances.</h1>

          {loadingResumes && resumes.length === 0 ? (
            <h2>
              Aucun CV disponible. Importez votre premier CV pour recevoir un
              retour.
            </h2>
          ) : (
            <h2>
              Passez en revue vos candidatures et recevez des conseils
              personnalisés par l’IA.
            </h2>
          )}
        </div>
        {loadingResumes && (
          <div className="flex flex-col justify-center ">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
        )}
        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loadingResumes && resume?.length === 0 && (
          <div className="flex  flex-center justify-center items-center mt-10 gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
            Télécharger un CV</Link>
          </div>
        )}
      </section>
    </main>
  );
}
