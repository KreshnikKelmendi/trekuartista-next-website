export default function Map() {
  return (
    <div>
      <div className="w-full">
        <iframe
          className="h-[60vh] w-full lg:h-[417px] 2xl:h-[80vh]"
          id="gmap_canvas"
          title="Location of Trekuartista"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2934.045531673183!2d21.14689637501742!3d42.660390516076355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13549f017ca6a309%3A0x272afdb51c6b65bc!2sTrekuartista!5e0!3m2!1sen!2s!4v1699412011049!5m2!1sen!2s"
        />
      </div>
    </div>
  );
}
