"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Gift,
  Clock,
  Shield,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations, useLocale } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("Contact");
  const locale = useLocale();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t("alert_success"));
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const contactItems = [
    {
      icon: Mail,
      title: "Email",
      content: "contact@iconrev.com",
      sub: t("email_sub"),
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Phone,
      title: "Phone",
      content: locale === "fr" ? "+33 1 00 00 00 00" : "+1 (512) 555-0142",
      sub: t("phone_sub"),
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      icon: MapPin,
      title: "Location",
      content: locale === "fr" ? "Nice 06200, France" : "Austin, TX",
      sub: t("location_sub"),
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-balance">
            {t("title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            {t("subtitle")}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <Card className="bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white border-0 shadow-lg shadow-blue-600/15">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
                  <Gift className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{t("audit_title")}</h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {t("audit_desc")}{" "}
                    <strong>{t("audit_free")}</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {contactItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.1 }}
            >
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div
                      className={`h-14 w-14 rounded-2xl ${item.bg} flex items-center justify-center`}
                    >
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                  </div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-foreground font-medium">
                    {item.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.sub}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl tracking-tight">
                {t("form_title")}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{t("form_hint")}</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      {t("name_label")}
                    </label>
                    <Input
                      id="name"
                      placeholder={t("name_placeholder")}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      {t("email_label")}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("email_placeholder")}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    {t("phone_label")}
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t("phone_placeholder")}
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    {t("message_label")}
                  </label>
                  <Textarea
                    id="message"
                    placeholder={t("message_placeholder")}
                    rows={6}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 font-bold"
                >
                  <Send className="mr-2 h-5 w-5" />
                  {t("submit")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
        >
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-blue-600" />
            {t("badge1")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-green-600" />
            {t("badge2")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            {t("badge3")}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
