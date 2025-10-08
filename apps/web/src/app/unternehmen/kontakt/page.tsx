"use client";

import React, { useState } from "react";
import Container from "@/components/container";
import SectionTitle from "@/components/section-title";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { colors } from "@/lib/colors";

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "E-Mail",
      content: "info@packchampion.de",
      link: "mailto:info@packchampion.de",
    },
    {
      icon: Phone,
      title: "Telefon",
      content: "+49 89 123456-0",
      link: "tel:+49891234560",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      content: "+49 123 456 789 00",
      link: "https://wa.me/4912345678900",
    },
    {
      icon: MapPin,
      title: "Adresse",
      content: "Merianweg 3, 93051 Regensburg",
      link: "https://maps.google.com/?q=Merianweg+3,+93051+Regensburg",
    },
  ];

  const openingHours = [
    { day: "Montag - Donnerstag", time: "08:00 - 17:00 Uhr" },
    { day: "Freitag", time: "08:00 - 15:00 Uhr" },
    { day: "Samstag - Sonntag", time: "Geschlossen" },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-white py-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: colors.lightGreen }}>
              Kontakt
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ color: colors.darkGreen }}>
              Wir freuen uns auf Ihre Nachricht
            </h1>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Haben Sie Fragen zu unseren Produkten oder möchten Sie eine individuelle Beratung? 
              Kontaktieren Sie uns – wir helfen Ihnen gerne weiter!
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20">
        <Container>
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6" style={{ color: colors.darkGreen }}>
                    Kontaktformular
                  </h2>
                  {submitted ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8" style={{ color: colors.darkGreen }} />
                      </div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: colors.darkGreen }}>
                        Vielen Dank für Ihre Nachricht!
                      </h3>
                      <p className="text-foreground/70">
                        Wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Name *
                          </label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ihr Name"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-2">
                            E-Mail *
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="ihre.email@beispiel.de"
                          />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium mb-2">
                            Telefon
                          </label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+49 123 456789"
                          />
                        </div>
                        <div>
                          <label htmlFor="company" className="block text-sm font-medium mb-2">
                            Unternehmen
                          </label>
                          <Input
                            id="company"
                            name="company"
                            type="text"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Ihr Unternehmen"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-2">
                          Betreff *
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Worum geht es?"
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                          Nachricht *
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Ihre Nachricht an uns..."
                          rows={6}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Nachricht senden
                      </Button>
                      <p className="text-sm text-foreground/60">
                        * Pflichtfelder
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              {/* Contact Details */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6" style={{ color: colors.darkGreen }}>
                    Kontaktinformationen
                  </h3>
                  <div className="space-y-4">
                    {contactInfo.map((info, idx) => (
                      <a
                        key={idx}
                        href={info.link}
                        target={info.link.startsWith("http") ? "_blank" : undefined}
                        rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="flex items-start gap-3 text-sm hover:text-emerald-600 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-200 transition-colors">
                          <info.icon className="w-5 h-5" style={{ color: colors.darkGreen }} />
                        </div>
                        <div>
                          <div className="font-medium mb-1">{info.title}</div>
                          <div className="text-foreground/70">{info.content}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Opening Hours */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5" style={{ color: colors.darkGreen }} />
                    <h3 className="text-xl font-bold" style={{ color: colors.darkGreen }}>
                      Öffnungszeiten
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {openingHours.map((hours, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-foreground/70">{hours.day}</span>
                        <span className="font-medium">{hours.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <Container>
          <SectionTitle
            kicker="Standort"
            title="So finden Sie uns"
            center
          />
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2659.5!2d12.0962!3d49.0134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479fc2b3b3b3b3b3%3A0x1!2sMerianweg%203%2C%2093051%20Regensburg!5e0!3m2!1sen!2sde!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="PackChampion Standort"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
