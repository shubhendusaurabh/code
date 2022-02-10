import { Container, Button, Input, Paper } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import CustomInput from "../components/formInput";
import Heading from "../components/UI/Heading";

export default function ({ setAlert, user }) {
  const router = useRouter();
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [files, setFiles] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (user) {
      console.log(user);
      axios
        .get(`/api/profile/${user.user_id}`)
        .then((res) => {
          axios.get(`api/files/author/${user.user_id}`).then((resolve)=>{
            setFiles(resolve.data)
            console.log(resolve.data)
            setProfile(res.data.profile);
          let profile = res.data.profile;
          setFirstName(profile.firstName);
          setLastName(profile.lastName);
          setAddress(profile.address);
          setCity(profile.city);
          setCountry(profile.country);
          setDescription(profile.description);
          setError(false);
          setLoading(false);
          }).catch((err)=>{
            console.log(err)
          })
        })
        .catch((err) => {
          setError(true);
          setLoading(false);
        });
    } else {
      setAlert("You have to be logged in!");
      router.push("/login");
    }
  }, []);

  const handleEdit = () => {
    const data = {
      firstName,
      lastName,
      address,
      city,
      description,
      country,
    };
    axios
      .put(`api/profile/${user.user_id}`, data)
      .then((res) => {
        setProfile(res.data.profile);
        let profile = res.data.profile;
        setFirstName(profile.firstName);
        setLastName(profile.lastName);
        setAddress(profile.address);
        setCity(profile.city);
        setCountry(profile.country);
        setDescription(profile.description);
        setEdit(false);
      })
      .catch((err) => {
        setError(true);
        setEdit(false);
      });
  };

  const submit = (e) => {
    e.preventDefault();

    let user;

    if (localStorage.getItem("user")) {
      user = JSON.parse(localStorage.getItem("user"));
    }

    if (user) {
      const data = {
        firstName,
        lastName,
        address,
        description,
        city,
        country,
      };

      axios
        .post(`/api/profile/${user.user_id}`, data)
        .then((res) => {
          console.log(res.data);
          setProfile(res.data.profile);
          console.log(profile);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleChangePassword = () => {
    axios.post(`/api/auth/reset-password`, {email: user.email}).then((res)=>{
      console.log(res.data)
      setAlert("Check your Email for further steps")
    }).catch((err)=>{
      console.log(err)
    })
  }

  const handleVerifyToken = () => {
    axios.post(`/api/auth/verify-email/resend-token`, {email: user.email}).then((res)=>{
      console.log(res.data)
      setAlert("Check your Email for further steps")
    }).catch((err)=>{
      console.log(err)
    })
  }

  const handleChangeEmail= () =>{
    axios.post(`/api/auth/change-email`, {email: user.email}).then((res)=>{
      console.log(res.data)
      setAlert("Check your Email for further steps")
    }).catch((err)=>{
      console.log(err)
    })
  }

  const profileForm = (
    <div
      style={{ padding: "6rem 0" }}
      className="flex items-center justify-center flex-col"
    >
      <Paper className="p-4 pt-0 w-full lg:w-96">
        <Heading type="sectionHeading">Create profile</Heading>
        <form onSubmit={submit} autoComplete="off">
          <div className="w-full my-3">
            <CustomInput
              required={true}
              label="First Name"
              setValue={setFirstName}
            />
          </div>

          <div className="w-full my-3">
            <CustomInput
              required={true}
              label="Last Name"
              setValue={setLastName}
            />
          </div>

          <div className="w-full my-3">
            <CustomInput
              required={true}
              label="Description"
              setValue={setDescription}
            />
          </div>

          <div className="w-full my-3">
            <CustomInput
              required={true}
              label="Address"
              setValue={setAddress}
            />
          </div>

          <div className="w-full my-3">
            <CustomInput required={true} label="City" setValue={setCity} />
          </div>

          <div className="w-full my-3">
            <CustomInput
              required={true}
              label="Country"
              setValue={setCountry}
            />
          </div>

          <Button
            style={{ backgroundColor: "blue", padding: "0.5rem 1rem" }}
            className="text-white text-bold"
            type="submit"
          >
            Create profile
          </Button>
        </form>
      </Paper>
    </div>
  );

  return (
    <Container className="mt-5">
      {loading ? (
        <p>Loading</p>
      ) : profile ? (
        <>
          <h2 className="profile-heading font-bold text-lg">Profile page</h2>
          <div className="profile-main">
            <div className="profile-info">
              <div className="profile-img">
                <img src="/code.png" />
              </div>
              <div className="profile-personal">
                <h2 className="profile-name font-bold">{`${firstName} ${lastName}`}</h2>
                <p className="profile-address text-gray-400">{`${city}, ${country}`}</p>
                {edit ? (
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                ) : (
                  <>
                    <p className="profile-description mb-2">{description}</p>
                    <Button
                      onClick={() => setEdit(true)}
                      style={{
                        backgroundColor: "blue",
                      }}
                    >
                      Edit profile
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="profile-details">
            <div className="profile-section">
              <h3 className="font-bold">Personal Information</h3>
              <div className="flex gap-3 flex gap-3">
                <label>First name</label>
                <Input
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  disabled={edit ? false : true}
                  label="name"
                />
              </div>
              <div className="flex gap-3">
                <label>Last name</label>
                <Input
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  disabled={edit ? false : true}
                  label="name"
                />
              </div>
              <div className="flex gap-3">
                <label>Address</label>
                <Input
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                  disabled={edit ? false : true}
                  label="Address"
                />
              </div>
              <div className="flex gap-3">
                <label>City</label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={edit ? false : true}
                  label="City"
                />
              </div>
              <div className="flex gap-3">
                <label>Country</label>
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  disabled={edit ? false : true}
                  label="Country"
                />
              </div>

              {!edit ? null : (
                <Button
                  onClick={handleEdit}
                  style={{
                    backgroundColor: "blue",
                  }}
                >
                  Save
                </Button>
              )}
            </div>
            <div className="profile-section">
            <h2 className="text-lg font-bold">Account Information</h2>
              <div className="flex gap-3 space-between mb-2">
                <p style={{minWidth: "15rem"}}>Number of files uploaded</p>
                <p>{files.totalFiles}</p> 
              </div>

              <div className="flex gap-3 space-between mb-2">
                <p style={{minWidth: "15rem"}}>Total file size</p>
                <p>{files.fileSize}KB</p> 
              </div>

              <div className="flex gap-3 space-between mb-2">
                <p style={{minWidth: "15rem"}}>Email</p>
                <p>{user.email}</p>
                <Button
                  onClick={handleChangeEmail}
                  style={{
                    backgroundColor: "blue",
                  }}
                >
                  Change Email
                </Button>
              </div>

              <div className="flex gap-3 space-between mb-2">
                <p style={{minWidth: "15rem"}}>Password</p>
                <p>.............</p>
                <Button
                  onClick={handleChangePassword}
                  style={{
                    backgroundColor: "blue",
                  }}
                >
                  Change Password
                </Button>
              </div>

              <div className="flex gap-3 space-between mb-2">
                <p style={{minWidth: "15rem"}}>Email verified</p>
                <p>{user.verified ? 'Yes' : 'No'}</p>
                {user.verified ? null : (<Button
                  onClick={handleVerifyToken}
                  style={{
                    backgroundColor: "blue",
                  }}
                >
                  Verify Email
                </Button>)}
              </div>
          </div>
          </div>
        </>
      ) : (
        profileForm
      )}
    </Container>
  );
}
