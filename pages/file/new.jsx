import Head from "next/head";
import crypto from "crypto";
import { useRouter } from "next/router";
import axios from "axios";
import { Button, Container, Input, Select, MenuItem } from "@material-ui/core";
import { useState } from "react";
import Heading from "../../components/UI/Heading";
import Editor from "@monaco-editor/react";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export async function getStaticProps({ locale }) {
  return {
    props: { ...(await serverSideTranslations(locale, ["new", "common"])) },
  };
}

const GoogleImport = dynamic(() => import("../../components/googleImport"), {
  ssr: false,
});

const OneDriveImport = dynamic(
  () => import("../../components/onedriveImport"),
  {
    ssr: false,
  }
);

const NewFile = ({ user, setAlert }) => {
  const {t} = useTranslation();
  const router = useRouter();
  const [fileName, setFileName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    let author_id;
    let jwtToken;
    if (user) {
      author_id = user.user_id;
      jwtToken = user.jwtToken;
    } else if (localStorage.getItem("guestId")) {
      author_id = localStorage.getItem("guestId");
    } else {
      const guestId = crypto.randomBytes(16).toString("hex");
      author_id = guestId;
      localStorage.setItem("guestId", guestId);
    }

    console.log(author_id);
    const data = {
      fileName,
      language,
      author_id,
      code,
    };

    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    console.log(jwtToken);
    axios.post("/api/files", data, config).then((res) => {
      console.log(res.data);
      router.push("/myfiles");
    });
  };

  const handleEditorChange = (value, event) => {
    console.log(event);
    setCode(value);
  };

  return (
    <>
      <Head>
        <title>New File | Code Sharing Application</title>
      </Head>
      <Container>
        <div className="py-6">
          <Heading className="mb-6" type="mainHeading">
            {t("new:new")}
          </Heading>
          <div className="mb-2">
            <form onSubmit={handleSubmit}>
              <Select
                value={language}
                label="Language"
                onChange={(e) => setLanguage(e.target.value)}
              >
                <MenuItem value="python">Python</MenuItem>
                <MenuItem value="javascript">JavaScript</MenuItem>
                <MenuItem value="cpp">C++</MenuItem>
                <MenuItem value="java">Java</MenuItem>
                <MenuItem value="html">HTML</MenuItem>
                <MenuItem value="css">CSS</MenuItem>
                <MenuItem value="markdown">Markdown</MenuItem>
              </Select>
              <Input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                style={{ marginLeft: "2rem" }}
                placeholder={t("new:file")}
              />
              <Button
                type="submit"
                style={{
                  backgroundColor: "blue",
                  padding: "0.1rem 0.5rem",
                  marginLeft: "0.5rem",
                }}
              >
                {t("new:save")}
              </Button>
            </form>
          </div>
          <Editor
            width="800"
            height="60vh"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
          />
          <div className="mt-5 flex">
            <GoogleImport
              setCode={setCode}
              setName={setFileName}
              setAlert={setAlert}
            />
            <OneDriveImport
              setCode={setCode}
              setName={setFileName}
              setAlert={setAlert}
            />
          </div>
        </div>
      </Container>
    </>
  );
};

export default NewFile;
