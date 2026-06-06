export default function ClubPage() {
  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold">Klub</h1>
        <p className="text-gray-600 mt-2">
          Osnovne informacije o vašem sportskom klubu.
        </p>
      </div>

      {/* CLUB INFO CARD */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Informacije o klubu</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-gray-500">Naziv kluba</p>
            <p className="text-lg font-medium">ABASA Sport</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Grad</p>
            <p className="text-lg font-medium">Pula</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-medium">kontakt@abasa.com</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Telefon</p>
            <p className="text-lg font-medium">+385 91 000 0000</p>
          </div>

        </div>
      </div>

      {/* COACHES */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Treneri</h3>

        <ul className="space-y-3">

          <li className="p-3 border rounded-lg hover:bg-gray-50 transition">
            Marko Horvat — Glavni trener
          </li>
          <li className="p-3 border rounded-lg hover:bg-gray-50 transition">
            Ana Kovač — Kondicijski trener
          </li>
          <li className="p-3 border rounded-lg hover:bg-gray-50 transition">
            Ivan Marić — Pomoćni trener
          </li>
        </ul>
      </div>

      {/* MEMBERS */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Članovi</h3>

        <p className="text-gray-600">
          Ukupno članova: <span className="font-semibold">128</span>
        </p>

        <a
          href="/users"
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Pogledaj sve članove →
        </a>
      </div>

    </div>
  );
}
