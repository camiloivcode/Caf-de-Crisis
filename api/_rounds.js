// Contenido de las 10 rondas. kind: lose | small | big. amount en millones de COP.
// El orden de las opciones aquí NO es el que ven los equipos: se baraja por partida.
export const ROUNDS = [
  {
    title: 'La guerra del dólar',
    story: `8:00 a. m. La TRM pasó de $4.000 a $4.250 COP/USD en cinco días. Los noticieros hablan de "pánico cambiario".

Su empresa debe pagar USD 500.000 en 90 días por una nueva línea de tostión y empaques importados de Alemania. Sus ventas nacionales se reciben en pesos. El banco llama: "Tienen 24 horas para decidir".`,
    options: [
      { kind: 'lose', amount: -150, text: 'Esperar sin cobertura: varios analistas en redes sociales aseguran que el dólar volverá a $3.900 la próxima semana.', why: 'Esperar a que el dólar baje es especular, no gestionar el riesgo. La TRM siguió subiendo hasta $4.550 y la maquinaria costó mucho más de lo presupuestado.' },
      { kind: 'small', amount: 40, text: 'Comprar hoy los USD 500.000 en el mercado spot a $4.250 y mantenerlos en una cuenta hasta el vencimiento.', why: 'Elimina la incertidumbre, pero deja quietos $2.125 millones de caja durante 90 días. Protege el precio y sacrifica liquidez.' },
      { kind: 'big', amount: 180, text: 'Contratar un forward de compra a 90 días por el 100% del pago, a una tasa pactada de $4.300.', why: 'Fija el costo sin desembolsar caja hoy. Al vencimiento la TRM estaba en $4.550: el forward ahorró $125 millones y la caja siguió trabajando.' },
    ],
  },
  {
    title: 'La sequía de Brasil',
    story: `Brasil, el mayor productor de café del mundo, pierde el 20% de su cosecha por una sequía histórica. El precio del café en la Bolsa de Nueva York se dispara.

Ustedes ya firmaron contratos de exportación a precio fijo con tostadores europeos para los próximos 6 meses, pero todavía no le han comprado el café a los productores colombianos.`,
    options: [
      { kind: 'big', amount: 200, text: 'Asegurar ya el abastecimiento: firmar contratos de compra a precio fijo con las cooperativas por todo el café comprometido.', why: 'Si vendiste a precio fijo, también debes fijar el costo. El precio interno subió 30% y ustedes ya tenían el café asegurado: el margen quedó protegido.' },
      { kind: 'small', amount: 50, text: 'Comprar a precio fijo la mitad del café hoy y la otra mitad en el mercado durante los próximos meses.', why: 'La cobertura parcial reduce el riesgo, pero la mitad abierta se compró más cara y se comió parte del margen.' },
      { kind: 'lose', amount: -150, text: 'Esperar a que pase el pánico y comprar el café más adelante, cuando los precios se "normalicen".', why: 'Con ventas a precio fijo y compras abiertas, la empresa quedó corta en café. El precio no bajó y los contratos pasaron a dar pérdida.' },
    ],
  },
  {
    title: 'El desplome del precio internacional',
    story: `Giro inesperado: las lluvias vuelven a Brasil y se anuncia una cosecha récord. Además, llegan capitales extranjeros a Colombia y el peso se fortalece.

Un cliente de Hamburgo les pagará USD 800.000 dentro de 120 días. Si el dólar cae, esos dólares valdrán menos pesos.`,
    options: [
      { kind: 'lose', amount: -200, text: 'Mantener los dólares sin vender ni cubrir: "el dólar en Colombia siempre vuelve a subir".', why: 'Un exportador está expuesto a la caída del dólar. La TRM bajó a $3.800 y los ingresos en pesos se desplomaron.' },
      { kind: 'big', amount: 200, text: 'Pactar con el banco un forward de venta de USD 800.000 a 120 días a $4.150.', why: 'El exportador se protege vendiendo con forward y asegura los pesos que va a recibir. Con la TRM en $3.800, ustedes vendieron a $4.150.' },
      { kind: 'small', amount: 60, text: 'Pedirle al cliente un anticipo del 30% y vender esos dólares hoy en spot; el resto se verá al vencimiento.', why: 'Reduce la exposición, pero el 70% quedó descubierto y se liquidó a una TRM más baja.' },
    ],
  },
  {
    title: 'El contrato millonario de Estados Unidos',
    story: `¡Gran noticia! Una cadena de cafeterías estadounidense firma con ustedes: recibirán USD 1.000.000 dentro de 180 días.

Al mismo tiempo, la empresa tiene un crédito bancario de USD 700.000 que vence también en 180 días. El banco les ofrece "cubrir todo" de inmediato.`,
    options: [
      { kind: 'small', amount: 60, text: 'Cubrir cada operación por separado: un forward de venta por el USD 1.000.000 del contrato y un forward de compra por los USD 700.000 del crédito.', why: 'Funciona, pero pagaron dos spreads bancarios por riesgos que se compensaban entre sí. Protección cara.' },
      { kind: 'big', amount: 250, text: 'Calcular la exposición neta: usar los dólares del contrato para pagar el crédito (cobertura natural) y cubrir con forward solo los USD 300.000 restantes.', why: 'Cobertura natural más un forward sobre el neto: menos derivados, menos costo y el riesgo controlado. Así se gestiona la exposición global de la empresa.' },
      { kind: 'lose', amount: -200, text: 'Sumar ambas operaciones y vender con forward USD 1.700.000, "por si acaso".', why: 'El crédito es una posición de compra de dólares, no de venta. Sobrecubrieron y quedaron especulando con USD 700.000 de más. El dólar subió y el forward generó pérdidas.' },
    ],
  },
  {
    title: 'La crisis logística del puerto',
    story: `Un paro bloquea el puerto de Buenaventura. Su embarque de café para Estados Unidos saldrá 60 días después de lo previsto, y el cliente pagará cuando reciba la mercancía.

Problema: el forward de venta que tenían contratado vence en 10 días… y para esa fecha no tendrán los dólares.`,
    options: [
      { kind: 'big', amount: 150, text: 'Negociar con el banco un roll-over: extender el forward 60 días ajustando la tasa con los puntos forward.', why: 'El instrumento debe coincidir con el flujo real. Extender el vencimiento mantiene la protección con un costo pequeño y conocido.' },
      { kind: 'lose', amount: -200, text: 'No hacer nada y explicarle al banco el día del vencimiento que no hay dólares: "ellos entenderán".', why: 'Incumplir un forward tiene consecuencias: el banco lo liquidó a precio de mercado, cobró penalidades y les recortó el cupo de crédito.' },
      { kind: 'small', amount: 40, text: 'Liquidar anticipadamente el forward por compensación (pagar o recibir la diferencia) y dejar sin cubrir los dólares que llegarán después.', why: 'Resuelve el problema inmediato, pero los 60 días extra quedaron expuestos. Salió bien, aunque por poco.' },
    ],
  },
  {
    title: 'El ataque especulativo del mercado',
    story: `Fondos internacionales apuestan contra el peso colombiano. La volatilidad es extrema: los expertos dicen que la TRM podría terminar en $3.900 o en $4.900.

Deben pagar USD 600.000 por fertilizantes y equipos en 90 días. El banco ofrece un forward a $4.350 o una opción Call con strike de $4.300 y una prima de $90 por dólar ($54 millones, que caben en el presupuesto).`,
    options: [
      { kind: 'lose', amount: -250, text: 'No cubrir el pago y además usar caja de la empresa para comprar dólares y venderlos "en el pico" del ataque.', why: 'Usar la tesorería para especular la expone a pérdidas. Compraron cerca de $4.700 y, cuando el ataque terminó, el dólar se desplomó a $3.950.' },
      { kind: 'small', amount: 70, text: 'Contratar el forward a $4.350 por el 100% del pago.', why: 'Los protegió de un posible pico, pero cuando el dólar cayó a $3.950 siguieron obligados a pagar $4.350. Quedaron protegidos y no aprovecharon la caída.' },
      { kind: 'big', amount: 220, text: 'Comprar la opción Call con strike de $4.300 y pagar la prima de $54 millones.', why: 'La opción da el derecho, no la obligación. Con la TRM en $3.950 no la ejercieron y compraron en spot: el costo efectivo fue $4.040 con la prima. Protección con potencial de ganancia.' },
    ],
  },
  {
    title: 'El boom mundial del café',
    story: `El café colombiano se pone de moda en Asia. Los precios internacionales están en récord y el dólar sigue subiendo.

Tienen contratos firmados por USD 1.500.000 y el equipo comercial jura que "seguro" llegarán otros USD 1.500.000 en pedidos. El banco ofrece forwards de venta a $4.400.`,
    options: [
      { kind: 'lose', amount: -250, text: 'Vender con forward USD 3.000.000: los contratos firmados y también los pedidos que "seguro" llegarán.', why: 'Cubrir operaciones que no existen es especular. Dos clientes nunca firmaron y la empresa tuvo que entregar dólares que no tenía, comprándolos más caros.' },
      { kind: 'big', amount: 300, text: 'Cubrir con forward el 75% de los contratos firmados y dejar el 25% abierto para aprovechar el alza.', why: 'Un rango de cobertura definido en la política protege la mayor parte del flujo y conserva flexibilidad. La parte abierta capturó el alza del dólar.' },
      { kind: 'small', amount: 80, text: 'Cubrir con forward el 100% de los contratos firmados, y nada más.', why: 'Correcto y prudente: no arriesgaron nada, pero tampoco aprovecharon nada del alza.' },
    ],
  },
  {
    title: 'La crisis de liquidez bancaria',
    story: `Un banco grande quiebra en Estados Unidos y los bancos colombianos cierran el crédito. La caja de la empresa está apretada.

Para mantener todas sus coberturas deben pagar $80 millones en primas de opciones nuevas y $120 millones en garantías de los forwards. Esa misma semana hay que pagar la nómina y a los caficultores.`,
    options: [
      { kind: 'lose', amount: -300, text: 'Mantener todas las coberturas pagando primas y garantías con la plata de la nómina y de los proveedores.', why: 'Una cobertura que deja a la empresa sin caja es una mala cobertura. Se retrasó la nómina, los caficultores suspendieron las entregas y llegaron multas.' },
      { kind: 'small', amount: 60, text: 'Cancelar todas las coberturas para liberar caja de inmediato.', why: 'Recuperaron liquidez pero quedaron expuestos. El dólar se movió poco y salieron casi ilesos: eso fue suerte, no gestión.' },
      { kind: 'big', amount: 250, text: 'Priorizar: mantener los forwards de los pagos más grandes, no renovar las opciones caras y negociar con el banco una línea de garantías respaldada por el contrato de EE. UU.', why: 'La cobertura y la liquidez van juntas. Protegieron los flujos críticos con instrumentos que no consumen caja y negociaron con un respaldo real.' },
    ],
  },
  {
    title: 'La última apuesta de los gigantes',
    story: `Aparece la oportunidad de la década: comprar la tostadora más grande de Bogotá por el equivalente a USD 2.000.000. Sus ingresos son 100% en pesos.

Un banco extranjero ofrece un crédito en dólares a una tasa bajísima. Los competidores también están mirando el negocio.`,
    options: [
      { kind: 'lose', amount: -400, text: 'Tomar el crédito en dólares sin cobertura, porque la tasa es la más baja del mercado, y pagarlo con las ventas en pesos de la tostadora.', why: 'Deuda en dólares pagada con ingresos en pesos es un descalce cambiario. El dólar subió 15% y la deuda se disparó.' },
      { kind: 'small', amount: 80, text: 'No comprar la tostadora: proteger el capital y esperar mejores condiciones.', why: 'Prudente y sin pérdidas, pero el mercado premió a quien creció con el riesgo controlado.' },
      { kind: 'big', amount: 350, text: 'Comprarla con un crédito en dólares que se paga con los ingresos de exportación (cobertura natural) y cubrir con forward el faltante.', why: 'La deuda quedó en la misma moneda que los ingresos que la pagan. Crecieron sin abrir una exposición nueva.' },
    ],
  },
  {
    title: 'El juicio final del mercado',
    story: `Asamblea de accionistas. Los inversionistas revisaron todo lo ocurrido este año y exigen una sola cosa antes de renovar su confianza:

"¿Cuál será, de ahora en adelante, la política de cobertura cambiaria de esta empresa?"`,
    options: [
      { kind: 'big', amount: 400, text: 'Política formal: cubrir entre el 50% y el 90% de la exposición neta a 6 meses; forwards para flujos ciertos y opciones para los inciertos; límites de pérdida; un comité que autoriza y ejecuta; indicadores con revisión mensual.', why: 'Cumple todos los elementos de una buena política: exposición neta, rangos, criterios por instrumento, horizontes, límites, responsables y seguimiento. Los inversionistas renovaron su confianza.' },
      { kind: 'small', amount: 100, text: 'Cubrir siempre el 100% de cada operación por separado con forward, por decisión del gerente financiero.', why: 'Protege, pero ignora la exposición neta, es costosa e inflexible y depende de una sola persona.' },
      { kind: 'lose', amount: -400, text: 'No tener política escrita: el gerente decide en cada caso según su lectura del mercado.', why: 'Las decisiones aisladas basadas en predicciones convierten la tesorería en un casino. Los inversionistas castigaron la falta de gobierno corporativo.' },
    ],
  },
];
