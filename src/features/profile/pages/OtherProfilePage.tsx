import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ref, get, child } from "firebase/database";
import { getFirebaseDatabase } from "@/shared/services/firebase";
import type { ChurchProfile } from "@/features/profile/types";
import { ArrowLeft, Send } from "@carbon/icons-react";
import { Grid, Column, Loading, Button } from "@carbon/react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { SendMessageModal } from "@/features/notifications/components/SendMessageModal";

const OtherProfilePage = () => {
  const { uid } = useParams<{ uid: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ChurchProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [msgModalOpen, setMsgModalOpen] = useState(false);

  useEffect(() => {
    if (!uid) {
      setIsLoading(false);
      return;
    }

    const db = getFirebaseDatabase();
    get(child(ref(db), `profiles/${uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setProfile(snapshot.val() as ChurchProfile);
          setIsLoading(false);
        } else {
          // Fallback: check /members/{uid}
          get(child(ref(db), `members/${uid}`))
            .then((memberSnapshot) => {
              if (memberSnapshot.exists()) {
                const memberData = memberSnapshot.val();
                const mappedProfile: ChurchProfile = {
                  uid,
                  firstName: memberData.firstName || "",
                  lastName: memberData.lastName || "",
                  middleName: "",
                  email: memberData.email || "",
                  phone: memberData.phone || "",
                  alternatePhone: "",
                  gender: memberData.gender || "",
                  dateOfBirth: memberData.age ? `${new Date().getFullYear() - memberData.age}-01-01` : "",
                  nationality: "",
                  nationalId: "",
                  profilePhotoUrl: memberData.photo || "",
                  address: "",
                  city: "",
                  country: "",
                  postalCode: "",
                  maritalStatus: memberData.maritalStatus || "",
                  spouseName: "",
                  numberOfChildren: "",
                  emergencyContact: { name: "", relationship: "", phone: "" },
                  membershipStatus: memberData.status === "active" ? "active" : memberData.status === "visitor" ? "visitor" : "inactive",
                  membershipNumber: memberData.id || "",
                  dateJoined: memberData.joinedAt || "",
                  baptismStatus: memberData.baptized ? "baptised" : "not_baptised",
                  baptismDate: "",
                  department: memberData.ministries?.find((m: any) => m.active)?.ministry || "",
                  cellGroup: memberData.cellGroup || "",
                  serviceUnit: "",
                  ministryRoles: memberData.ministries?.filter((m: any) => m.active).map((m: any) => m.role) || [],
                  spiritualGifts: [],
                  occupation: "",
                  employer: "",
                  role: "member",
                  createdAt: memberData.joinedAt || new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
                setProfile(mappedProfile);
              } else {
                setProfile(null);
              }
              setIsLoading(false);
            })
            .catch(() => {
              setProfile(null);
              setIsLoading(false);
            });
        }
      })
      .catch(() => {
        setProfile(null);
        setIsLoading(false);
      });
  }, [uid]);

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <Loading description="Loading profile…" withOverlay={false} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ padding: "2rem" }}>
        <p>Profile not found.</p>
        <Link to="/search">Back to search</Link>
      </div>
    );
  }

  const fullName =
    [profile.firstName, profile.middleName, profile.lastName]
      .filter(Boolean)
      .join(" ") || "Unknown";

  return (
    <div style={{ padding: "2rem" }}>
      <Grid>
        <Column lg={16} md={8} sm={4}>
          <Link
            to="/search"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1.5rem",
              color: "var(--cds-link-primary)",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={16} />
            Back to search
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              marginBottom: "2rem",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "var(--cds-layer-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  color: "var(--cds-text-primary)",
                  overflow: "hidden",
                }}
              >
                {profile.profilePhotoUrl ? (
                  <img
                    src={profile.profilePhotoUrl}
                    alt={fullName}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  `${profile.firstName?.charAt(0) ?? ""}${profile.lastName?.charAt(0) ?? ""}`
                )}
              </div>
              <div>
                <h1 style={{ margin: 0 }}>{fullName}</h1>
                <p style={{ margin: 0, color: "var(--cds-text-secondary)" }}>
                  {profile.role ?? "member"}
                  {profile.department ? ` · ${profile.department}` : ""}
                  {profile.cellGroup ? ` · ${profile.cellGroup}` : ""}
                </p>
              </div>
            </div>

            {user && uid && user.uid !== uid && (
              <Button
                kind="primary"
                size="md"
                renderIcon={Send}
                onClick={() => setMsgModalOpen(true)}
              >
                Send Message
              </Button>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            {profile.email && (
              <div>
                <strong>Email</strong>
                <p>{profile.email}</p>
              </div>
            )}
            {profile.phone && (
              <div>
                <strong>Phone</strong>
                <p>{profile.phone}</p>
              </div>
            )}
            {profile.membershipStatus && (
              <div>
                <strong>Status</strong>
                <p>{profile.membershipStatus}</p>
              </div>
            )}
            {profile.dateJoined && (
              <div>
                <strong>Joined</strong>
                <p>{new Date(profile.dateJoined).toLocaleDateString()}</p>
              </div>
            )}
            {profile.occupation && (
              <div>
                <strong>Occupation</strong>
                <p>{profile.occupation}</p>
              </div>
            )}
            {profile.employer && (
              <div>
                <strong>Employer</strong>
                <p>{profile.employer}</p>
              </div>
            )}
          </div>
        </Column>
      </Grid>

      {user && uid && (
        <SendMessageModal
          open={msgModalOpen}
          onClose={() => setMsgModalOpen(false)}
          recipientUid={uid}
          recipientName={fullName}
        />
      )}
    </div>
  );
};

export default OtherProfilePage;
