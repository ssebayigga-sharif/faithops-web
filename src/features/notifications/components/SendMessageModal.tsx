import React, { useState, useEffect } from "react";
import {
  Modal,
  TextInput,
  TextArea,
  InlineNotification,
  Loading,
  Toggle,
} from "@carbon/react";
import { NotificationService } from "../services/notification.service";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { SearchService } from "@/features/search/services/search.service";

interface SendMessageModalProps {
  open: boolean;
  onClose: () => void;
  recipientUid?: string;
  recipientEmail?: string;
  recipientName: string;
}

export const SendMessageModal: React.FC<SendMessageModalProps> = ({
  open,
  onClose,
  recipientUid,
  recipientEmail,
  recipientName,
}) => {
  const { user } = useAuth();
  const { profile: senderProfile } = useProfile();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [resolvedUid, setResolvedUid] = useState<string | null>(null);
  const [resolvedEmail, setResolvedEmail] = useState<string>("");
  const [resolvedName, setResolvedName] = useState<string>("");
  const [sendEmailFallback, setSendEmailFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // For compose-from-header: allow user to type recipient email
  const [manualRecipientEmail, setManualRecipientEmail] = useState("");
  const [isLookupByEmail, setIsLookupByEmail] = useState(false);

  // Derive whether we're in "compose new" mode (no recipient info provided)
  const isComposeNew = !recipientUid && !recipientEmail && !recipientName;

  // Resolve UID from email if not provided directly
  useEffect(() => {
    if (open) {
      if (recipientUid) {
        setResolvedUid(recipientUid);
        setResolvedEmail(recipientEmail || "");
        setResolvedName(recipientName);
        setSendEmailFallback(false);
        setManualRecipientEmail("");
        setIsLookupByEmail(false);
      } else if (recipientEmail) {
        setIsLookupByEmail(true);
        setIsSearching(true);
        setError(null);
        setManualRecipientEmail(recipientEmail);
        SearchService.searchProfiles(recipientEmail)
          .then((results) => {
            const match = results.find(
              (r) => r.email?.toLowerCase() === recipientEmail.toLowerCase(),
            );
            if (match) {
              setResolvedUid(match.uid);
              setResolvedEmail(recipientEmail);
              setResolvedName(recipientName);
              setSendEmailFallback(false);
            } else {
              setResolvedUid(null);
              setResolvedEmail(recipientEmail);
              setSendEmailFallback(true);
            }
          })
          .catch(() => {
            setResolvedUid(null);
            setResolvedEmail(recipientEmail);
            setSendEmailFallback(true);
          })
          .finally(() => {
            setIsSearching(false);
          });
      } else {
        setResolvedUid(null);
        setResolvedEmail("");
        setResolvedName("");
        setSendEmailFallback(false);
        setManualRecipientEmail("");
        setIsLookupByEmail(false);
      }
    } else {
      // Reset state on close
      setTitle("");
      setBody("");
      setError(null);
      setSuccess(false);
      setManualRecipientEmail("");
      setIsLookupByEmail(false);
      setResolvedEmail("");
      setResolvedName("");
    }
  }, [open, recipientUid, recipientEmail, recipientName]);

  // Manual email lookup for compose-new
  const handleManualEmailLookup = async () => {
    const email = manualRecipientEmail.trim();
    if (!email) {
      setError("Please enter a recipient email address.");
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const results = await SearchService.searchProfiles(email);
      const match = results.find(
        (r) => r.email?.toLowerCase() === email.toLowerCase(),
      );
      if (match) {
        setResolvedUid(match.uid);
        setResolvedEmail(email);
        setResolvedName(
          [match.firstName, match.lastName].filter(Boolean).join(" ") || email,
        );
        setSendEmailFallback(false);
      } else {
        setResolvedUid(null);
        setResolvedEmail(email);
        setResolvedName(email);
        setSendEmailFallback(true);
      }
      setIsLookupByEmail(true);
    } catch {
      setResolvedUid(null);
      setResolvedEmail(email);
      setResolvedName(email);
      setSendEmailFallback(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("Please enter a subject and message content.");
      return;
    }
    if (!user) {
      setError("You must be signed in to send messages.");
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const senderName =
        [senderProfile?.firstName, senderProfile?.lastName]
          .filter(Boolean)
          .join(" ") ||
        user.displayName ||
        user.email ||
        "Church Member";

      if (resolvedUid && !sendEmailFallback) {
        // Send in-app direct message
        await NotificationService.send({
          type: "message",
          title: title.trim(),
          body: body.trim(),
          senderUid: user.uid,
          senderName,
          recipientUid: resolvedUid,
        });
      } else if (resolvedEmail) {
        // Send email message fallback
        await NotificationService.sendEmail({
          to: resolvedEmail,
          subject: title.trim(),
          textBody: body.trim(),
          htmlBody: `
            <div style="font-family: sans-serif; padding: 24px; color: #161616; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #0f2d52; margin-top: 0; font-size: 20px; font-weight: 600;">Message from ${senderName}</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #262626; background: #f4f4f4; padding: 16px; border-left: 4px solid #0f2d52; border-radius: 4px; white-space: pre-wrap; margin: 20px 0;">${body.trim()}</p>
              <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 24px 0;" />
              <small style="color: #6f6f6f; display: block; font-size: 12px; text-align: center;">This message was shared through the FaithOps Kabulengwa SDA Church portal.</small>
            </div>
          `,
        });
      } else {
        throw new Error(
          "Unable to deliver message: no recipient email address found.",
        );
      }

      setSuccess(true);
      setTitle("");
      setBody("");
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err?.message || "Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const showRecipientInput = isComposeNew && !isLookupByEmail;
  const isEmailOnly = !resolvedUid && !!resolvedEmail;
  const displayName = resolvedName || recipientName;
  const canSend = resolvedUid || resolvedEmail;

  return (
    <Modal
      open={open}
      modalHeading={
        isSearching
          ? "Searching member profile..."
          : isComposeNew
            ? "New Message"
            : `Send Message to ${displayName}`
      }
      primaryButtonText={isSending ? "Sending..." : "Send"}
      secondaryButtonText="Cancel"
      onRequestClose={onClose}
      onRequestSubmit={
        showRecipientInput ? handleManualEmailLookup : handleSend
      }
      primaryButtonDisabled={
        isSending ||
        isSearching ||
        !title.trim() ||
        !body.trim() ||
        success ||
        (showRecipientInput ? !manualRecipientEmail.trim() : !canSend)
      }
    >
      {isSearching ? (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "2rem" }}
        >
          <Loading
            description="Looking up member details..."
            withOverlay={false}
          />
        </div>
      ) : (
        <form
          onSubmit={showRecipientInput ? handleManualEmailLookup : handleSend}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            marginTop: "1rem",
          }}
        >
          {error && (
            <InlineNotification
              kind="error"
              title="Error"
              subtitle={error}
              lowContrast
              onClose={() => setError(null)}
            />
          )}

          {success && (
            <InlineNotification
              kind="success"
              title="Success"
              subtitle="Message sent successfully!"
              lowContrast
            />
          )}

          {/* Recipient email input for compose-new mode */}
          {showRecipientInput && (
            <TextInput
              id="msg-recipient"
              labelText="Recipient Email"
              placeholder="Enter member email address"
              value={manualRecipientEmail}
              onChange={(e) => setManualRecipientEmail(e.target.value)}
              disabled={isSending || success}
              required
            />
          )}

          {/* Already-resolved recipient info */}
          {isLookupByEmail && displayName && (
            <InlineNotification
              kind="info"
              title={`Sending to: ${displayName}`}
              subtitle={
                resolvedEmail
                  ? `via ${sendEmailFallback ? "email" : "in-app message"}`
                  : ""
              }
              lowContrast
              hideCloseButton
            />
          )}

          {isEmailOnly && (
            <InlineNotification
              kind="info"
              title="Unregistered Member"
              subtitle="This member has not registered an online account. The message will be sent to their email address."
              lowContrast
              hideCloseButton
            />
          )}

          {resolvedUid && resolvedEmail && (
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <Toggle
                id="send-method-toggle"
                labelText="Delivery Method"
                labelA="In-app Message"
                labelB="Email"
                toggled={sendEmailFallback}
                onChange={() => setSendEmailFallback(!sendEmailFallback)}
                disabled={isSending || success}
              />
            </div>
          )}

          <TextInput
            id="msg-title"
            labelText="Subject"
            placeholder="Enter message subject"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSending || success}
            required
          />

          <TextArea
            id="msg-body"
            labelText="Message"
            placeholder="Type your message here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={isSending || success}
            rows={5}
            required
          />
        </form>
      )}
    </Modal>
  );
};
