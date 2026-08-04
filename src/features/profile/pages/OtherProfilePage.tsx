import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ref, get, child } from "firebase/database";
import { getFirebaseDatabase } from "../../../shared/services/firebase";
import type { ChurchProfile } from "../types";
import { ArrowLeft, Send } from "@carbon/icons-react";
import {
  Grid,
  Column,
  Loading,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Tile,
} from "@carbon/react";
import { useAuth } from "../../auth/context/AuthContext";
import { ProfileHeroHeader } from "../components/ProfileHeroHeader";
import { SendMessageModal } from "../../notifications/components/SendMessageModal";

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
                  dateOfBirth: memberData.age
                    ? `${new Date().getFullYear() - memberData.age}-01-01`
                    : "",
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
                  membershipStatus:
                    memberData.status === "active"
                      ? "active"
                      : memberData.status === "visitor"
                        ? "visitor"
                        : "inactive",
                  membershipNumber: memberData.id || "",
                  dateJoined: memberData.joinedAt || "",
                  baptismStatus: memberData.baptized
                    ? "baptised"
                    : "not_baptised",
                  baptismDate: "",
                  department:
                    memberData.ministries?.find((m: any) => m.active)
                      ?.ministry || "",
                  cellGroup: memberData.cellGroup || "",
                  serviceUnit: "",
                  ministryRoles:
                    memberData.ministries
                      ?.filter((m: any) => m.active)
                      .map((m: any) => m.role) || [],
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

          <ProfileHeroHeader
            mode="view"
            profile={profile}
            isOwner={false}
            onSendMessage={() => setMsgModalOpen(true)}
          />

          <div style={{ marginTop: "1.5rem" }}>
            <Tabs>
              <TabList aria-label="Other profile sections" contained>
                <Tab>Overview</Tab>
                <Tab>Church & Ministry</Tab>
                <Tab>Family & Household</Tab>
                <Tab>Activity</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Tile className="profile-section">
                    <h2 className="profile-section__heading">Overview</h2>
                    <div className="profile-view-grid">
                      <div className="profile-view-item">
                        <span className="profile-view-label">Email</span>
                        <span className="profile-view-value">
                          {profile.email || "—"}
                        </span>
                      </div>
                      <div className="profile-view-item">
                        <span className="profile-view-label">Phone</span>
                        <span className="profile-view-value">
                          {profile.phone || "—"}
                        </span>
                      </div>
                      <div className="profile-view-item">
                        <span className="profile-view-label">Department</span>
                        <span className="profile-view-value">
                          {profile.department || "—"}
                        </span>
                      </div>
                      <div className="profile-view-item">
                        <span className="profile-view-label">Cell Group</span>
                        <span className="profile-view-value">
                          {profile.cellGroup || "—"}
                        </span>
                      </div>
                    </div>
                  </Tile>
                </TabPanel>
                <TabPanel>
                  <Tile className="profile-section">
                    <h2 className="profile-section__heading">
                      Church & Ministry
                    </h2>
                    <div className="profile-view-grid">
                      <div className="profile-view-item">
                        <span className="profile-view-label">
                          Membership Status
                        </span>
                        <span className="profile-view-value">
                          {profile.membershipStatus || "—"}
                        </span>
                      </div>
                      <div className="profile-view-item">
                        <span className="profile-view-label">Date Joined</span>
                        <span className="profile-view-value">
                          {profile.dateJoined
                            ? new Date(profile.dateJoined).toLocaleDateString()
                            : "—"}
                        </span>
                      </div>
                      <div className="profile-view-item">
                        <span className="profile-view-label">Baptism</span>
                        <span className="profile-view-value">
                          {profile.baptismStatus || "—"}
                        </span>
                      </div>
                      <div className="profile-view-item">
                        <span className="profile-view-label">
                          Ministry Roles
                        </span>
                        <span className="profile-view-value">
                          {profile.ministryRoles?.length
                            ? profile.ministryRoles.join(", ")
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </Tile>
                </TabPanel>
                <TabPanel>
                  <Tile className="profile-section">
                    <h2 className="profile-section__heading">
                      Family & Household
                    </h2>
                    <div className="profile-view-grid">
                      <div className="profile-view-item">
                        <span className="profile-view-label">
                          Marital Status
                        </span>
                        <span className="profile-view-value">
                          {profile.maritalStatus || "—"}
                        </span>
                      </div>
                      <div className="profile-view-item">
                        <span className="profile-view-label">Spouse Name</span>
                        <span className="profile-view-value">
                          {profile.spouseName || "—"}
                        </span>
                      </div>
                      <div className="profile-view-item">
                        <span className="profile-view-label">Children</span>
                        <span className="profile-view-value">
                          {profile.numberOfChildren ?? "—"}
                        </span>
                      </div>
                      <div className="profile-view-item">
                        <span className="profile-view-label">
                          Emergency Contact
                        </span>
                        <span className="profile-view-value">
                          {profile.emergencyContact?.name
                            ? `${profile.emergencyContact.name} (${profile.emergencyContact.relationship}) • ${profile.emergencyContact.phone}`
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </Tile>
                </TabPanel>
                <TabPanel>
                  <Tile className="profile-section">
                    <h2 className="profile-section__heading">Activity</h2>
                    <div className="profile-view-grid">
                      <div className="profile-view-item">
                        <span className="profile-view-label">Last Updated</span>
                        <span className="profile-view-value">
                          {profile.updatedAt
                            ? new Date(profile.updatedAt).toLocaleDateString()
                            : "—"}
                        </span>
                      </div>
                      <div className="profile-view-item">
                        <span className="profile-view-label">
                          Membership Number
                        </span>
                        <span className="profile-view-value">
                          {profile.membershipNumber || "—"}
                        </span>
                      </div>
                      <div className="profile-view-item">
                        <span className="profile-view-label">
                          Profile Status
                        </span>
                        <span className="profile-view-value">
                          {profile.membershipStatus || "—"}
                        </span>
                      </div>
                    </div>
                  </Tile>
                </TabPanel>
              </TabPanels>
            </Tabs>
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
