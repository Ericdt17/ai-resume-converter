import React from "react";
import Navbar from "~/components/Navbar";
import { useState, type FormEvent } from "react";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2image";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState(
    "Téléchargez votre CV pour commencer à l'analyser",
  );
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
      companyName,
      jobTitle,
      jobDescription,
      file,
    }: {
      companyName: string;
      jobTitle: string;
      jobDescription: string;
      file: File;
    }) => {
      setIsProcessing(true);
      setStatusText("Importation en cours...");
      const uploadedFile = await fs.upload([file]);

      if (!uploadedFile)
        return setStatusText("Erreur lors de l'importation du fichier");
      setStatusText("Conversion en image…...");
      const imageFile = await convertPdfToImage(file);
    
      if (!imageFile.file) return setStatusText("Erreur lors de la conversion en image");

      setStatusText("Impotation de l'image en cours...");
      const uploadedImage = await fs.upload([imageFile.file]);
      if (!uploadedImage) return setStatusText("Erreur lors de l'importation de l'image");

      setStatusText("Préparation des données...");

      const uuid = generateUUID();
      const data = {
        id : uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName, jobTitle, jobDescription, feedback: '',
      }
      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      setStatusText("Analyse en cours...");

      const feedback = await ai.feedback(
        uploadedFile.path,
        prepareInstructions({jobTitle, jobDescription})
      )
      if (!feedback) return setStatusText("Erreur lors de l'analyse");
      const feedbackText = typeof feedback.message.content === 'string' 
      ? feedback.message.content
      : feedback.message.content[0].text
      data.feedback = JSON.parse(feedbackText);
      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      setStatusText("Analyse terminée, redirigtion vers la page de résultat...");
      console.log(data);
      navigate(`/resume/${uuid}`);
    };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return;
    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>
            Des retours intelligents pour décrocher le poste de vos rêves.
          </h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" className="w-full" />
            </>
          ) : (
            <h2>
              Déposez votre CV pour obtenir un score ATS et des conseils
              d’amélioration.
            </h2>
          )}
          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >
              <div className="form-div">
                <label htmlFor="company-name">Nom de l’entreprise</label>
                <input
                  type="text"
                  id="company-name"
                  name="company-name"
                  placeholder="Nom de l’entreprise"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Intitulé du poste</label>
                <input
                  type="text"
                  id="job-title"
                  name="job-title"
                  placeholder="Intitulé du poste"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Description de l’offre</label>
                <textarea
                  rows={5}
                  id="job-description"
                  name="job-description"
                  placeholder="Description de l’offre"
                />
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Importer un CV</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>
              <button className="primary-button" type="submit">
                Analyser mon CV
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
