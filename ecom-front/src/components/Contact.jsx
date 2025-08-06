import { FaMapMarkedAlt, FaPhone, FaRegEnvelope } from "react-icons/fa";

const Contact = () => {
  return (
    <div 
    style={{backgroundImage: "url()"}}
    className="flex flex-col items-center justify-center  h-full w-full py-12 bg-cover bg-center">
      {/* https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg */}
     
     
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-4xl font-bold text-center mb-6">Contact Us</h1>

        <p>
          We would love to hear from you! Please fill out the form below or
          contact us on email.
        </p>

        <form className="space-y-4">
          <div>
            <label className="text-gray-700 block text-small font-medium">
              Name
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="text-gray-700 block text-small font-medium">
              Email
            </label>
            <input
              type="email"
              required
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="text-gray-700 block text-small font-medium">
              Message
            </label>
            <textarea
              rows="4"
              required
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 ">
            Send Message
          </button>
        </form>

        <div className="mt-8 text-center">
            <h2 className="text-lg font-semibold">Contact Information</h2>
            <div className="flex flex-col items-center space-y-2 mt-4">
                <div className="flex items-center">
                    <FaPhone className="text-blue-500 mr-2"/>
                    <span>+94 763384586</span>
                </div>

                <div className="flex items-center">
                    <FaRegEnvelope className="text-blue-500 mr-2"/>
                    <span>harshanaprabhath147@gmail.com</span>
                </div>

                <div className="flex items-center">
                    <FaMapMarkedAlt className="text-blue-500 mr-2"/>
                    <span>147/1, Galgamuwa, Sri Lanka</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
