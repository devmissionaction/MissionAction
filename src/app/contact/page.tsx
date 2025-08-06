export default function ContactPage() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Contact</h1>
      <p className="mb-4">
        Vous souhaitez nous contacter pour une question, une proposition d’article ou pour rejoindre l’association ? N’hésitez pas à nous écrire :
      </p>

      <ul className="mb-6">
        <li><strong>Email :</strong> <a href="mailto:dev.nomdelarevue@gmail.com" className="text-blue-600 hover:underline">missionaction@gmail.com</a></li>
        <li><strong>Instagram :</strong> <a href="https://instagram.com/missionaction" className="text-blue-600 hover:underline">@missionaction</a></li>
      </ul>

      <p>
        Nous faisons de notre mieux pour répondre sous 48h.
      </p>
    </main>
  )
}
