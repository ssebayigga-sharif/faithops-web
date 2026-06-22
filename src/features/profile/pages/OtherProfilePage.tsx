/**
 * OtherProfilePage.tsx
 *
 * Displays a read-only view of another member's profile, fetched by UID
 * from the URL parameter. Search results link here.
 */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ref, get, child } from "firebase/database";
import { getFirebaseDatabase } from "@/shared/services/firebase";
import type { ChurchProfile } from "@/features/profile/types";
import { ArrowLeft } from "@carbon/icons-react";
import { Grid, Column, Loading } from "@carbon/react";

const OtherProfilePage = () => {
  const { uid } = useParams<{ uid: string }>();
  const [profile, setProfile] = useState<ChurchProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setIsLoading(false);
      return;
    }

    const db = getFirebaseDatabase();
    get(child(ref(db), `profiles/${uid}`))
      .then((snapshot) => {
        setProfile(
          snapshot.exists() ? (snapshot.val() as ChurchProfile) : null,
        );
      })
      .catch(() => setProfile(null))
      .finally(() => setIsLoading(false));
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
              gap: "1rem",
              marginBottom: "2rem",
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
    </div>
  );
};

export default OtherProfilePage;
