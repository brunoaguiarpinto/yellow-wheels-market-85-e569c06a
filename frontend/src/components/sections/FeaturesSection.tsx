
const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl font-montserrat font-bold text-black mb-4">
            Por que escolher a Lord Motors?
          </h2>
          <p className="text-lg font-opensans text-gray-600 max-w-2xl mx-auto">
            Oferecemos a melhor experiência em compra e venda de veículos com tecnologia de ponta
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-lg hover:shadow-xl transition-shadow duration-300 animate-slide-up bg-white">
            <div className="w-16 h-16 bg-accent rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-2xl">🚗</span>
            </div>
            <h3 className="text-xl font-montserrat font-bold text-black mb-4">Qualidade Garantida</h3>
            <p className="font-opensans text-gray-600">
              Todos os veículos passam por rigorosa inspeção antes de serem disponibilizados
            </p>
          </div>
          
          <div className="text-center p-8 rounded-lg hover:shadow-xl transition-shadow duration-300 animate-slide-up bg-white">
            <div className="w-16 h-16 bg-accent rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-montserrat font-bold text-black mb-4">Melhor Preço</h3>
            <p className="font-opensans text-gray-600">
              Preços competitivos e transparentes, sem taxas ocultas ou surpresas
            </p>
          </div>
          
          <div className="text-center p-8 rounded-lg hover:shadow-xl transition-shadow duration-300 animate-slide-up bg-white">
            <div className="w-16 h-16 bg-accent rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="text-xl font-montserrat font-bold text-black mb-4">Atendimento Premium</h3>
            <p className="font-opensans text-gray-600">
              Equipe especializada pronta para atender suas necessidades com excelência
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
