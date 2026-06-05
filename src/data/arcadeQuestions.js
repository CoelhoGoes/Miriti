/**
 * Banco de questões do Modo Arcade.
 * Separado das questões do Modo História (data/questions.js).
 * Foco: raciocínio rápido, gestão de recursos, decisão financeira.
 *
 * reward: moedas ganhas por resposta certa (padrão: 10)
 */

export const ARCADE_QUESTIONS = [
  {
    id: 'aq_01',
    question: { pt: 'Você tem 200 moedas. Compra um produto por 80. Quanto sobra?', en: 'You have 200 coins. You buy a product for 80. How much is left?' },
    options: [
      { id: 'a', text: { pt: '120 moedas', en: '120 coins' }, correct: true },
      { id: 'b', text: { pt: '140 moedas', en: '140 coins' }, correct: false },
      { id: 'c', text: { pt: '80 moedas', en: '80 coins' }, correct: false },
      { id: 'd', text: { pt: '100 moedas', en: '100 coins' }, correct: false },
    ],
    explanation: { pt: '200 − 80 = 120 moedas.', en: '200 − 80 = 120 coins.' },
    reward: 10,
  },
  {
    id: 'aq_02',
    question: { pt: 'Você comprou açaí por 15 moedas. Agora vale 22. Qual é o lucro se vender 1?', en: 'You bought açaí for 15 coins. It is now worth 22. What is the profit if you sell 1?' },
    options: [
      { id: 'a', text: { pt: '7 moedas', en: '7 coins' }, correct: true },
      { id: 'b', text: { pt: '5 moedas', en: '5 coins' }, correct: false },
      { id: 'c', text: { pt: '22 moedas', en: '22 coins' }, correct: false },
      { id: 'd', text: { pt: '15 moedas', en: '15 coins' }, correct: false },
    ],
    explanation: { pt: '22 − 15 = 7 moedas de lucro.', en: '22 − 15 = 7 coins profit.' },
    reward: 10,
  },
  {
    id: 'aq_03',
    question: { pt: 'Um produto cai de preço todos os dias. A melhor estratégia é:', en: 'A product is falling in price every day. The best strategy is:' },
    options: [
      { id: 'a', text: { pt: 'Esperar cair mais e comprar barato', en: 'Wait for it to fall more and buy cheap' }, correct: true },
      { id: 'b', text: { pt: 'Comprar agora antes de cair mais', en: 'Buy now before it falls further' }, correct: false },
      { id: 'c', text: { pt: 'Vender tudo imediatamente', en: 'Sell everything immediately' }, correct: false },
      { id: 'd', text: { pt: 'Ignorar o preço', en: 'Ignore the price' }, correct: false },
    ],
    explanation: { pt: 'Preço em queda = oportunidade de compra. Aguarde o fundo e compre barato.', en: 'Falling price = buying opportunity. Wait for the bottom and buy cheap.' },
    reward: 15,
  },
  {
    id: 'aq_04',
    question: { pt: 'Você tem 500 moedas e quer maximizar lucro. Qual decisão é mais inteligente?', en: 'You have 500 coins and want to maximize profit. Which decision is smarter?' },
    options: [
      { id: 'a', text: { pt: 'Dividir entre vários produtos baratos', en: 'Split between several cheap products' }, correct: true },
      { id: 'b', text: { pt: 'Gastar tudo em um único produto', en: 'Spend it all on one product' }, correct: false },
      { id: 'c', text: { pt: 'Guardar tudo e não comprar nada', en: 'Keep it all and buy nothing' }, correct: false },
      { id: 'd', text: { pt: 'Comprar o produto mais caro', en: 'Buy the most expensive product' }, correct: false },
    ],
    explanation: { pt: 'Diversificar reduz o risco: se um produto cair, os outros compensam.', en: 'Diversifying reduces risk: if one product falls, others compensate.' },
    reward: 15,
  },
  {
    id: 'aq_05',
    question: { pt: 'Preço do cacau sobe 20% toda semana. Você o comprou por 50 moedas. Quanto vale após 1 semana?', en: 'Cocoa price rises 20% every week. You bought it for 50 coins. How much is it worth after 1 week?' },
    options: [
      { id: 'a', text: { pt: '60 moedas', en: '60 coins' }, correct: true },
      { id: 'b', text: { pt: '70 moedas', en: '70 coins' }, correct: false },
      { id: 'c', text: { pt: '55 moedas', en: '55 coins' }, correct: false },
      { id: 'd', text: { pt: '50 moedas', en: '50 coins' }, correct: false },
    ],
    explanation: { pt: '50 × 1,20 = 60 moedas.', en: '50 × 1.20 = 60 coins.' },
    reward: 20,
  },
  {
    id: 'aq_06',
    question: { pt: 'O que é lucro?', en: 'What is profit?' },
    options: [
      { id: 'a', text: { pt: 'O que sobra depois de pagar todos os custos', en: 'What remains after paying all costs' }, correct: true },
      { id: 'b', text: { pt: 'O total de dinheiro ganho na venda', en: 'The total money earned from the sale' }, correct: false },
      { id: 'c', text: { pt: 'O preço de custo do produto', en: 'The cost price of the product' }, correct: false },
      { id: 'd', text: { pt: 'O dinheiro que você não usou', en: 'The money you did not use' }, correct: false },
    ],
    explanation: { pt: 'Lucro = receita − custo. É o que fica depois de descontar o que foi gasto.', en: 'Profit = revenue − cost. It is what remains after deducting expenses.' },
    reward: 10,
  },
  {
    id: 'aq_07',
    question: { pt: 'Castanha custa 30 hoje e 20 amanhã. Quando é melhor comprar?', en: 'Brazil nut costs 30 today and 20 tomorrow. When is it better to buy?' },
    options: [
      { id: 'a', text: { pt: 'Amanhã — está mais barato', en: 'Tomorrow — it is cheaper' }, correct: true },
      { id: 'b', text: { pt: 'Hoje — pode subir mais amanhã', en: 'Today — it might go up tomorrow' }, correct: false },
      { id: 'c', text: { pt: 'Tanto faz, o preço não importa', en: 'Does not matter, price is irrelevant' }, correct: false },
      { id: 'd', text: { pt: 'Nunca comprar castanha', en: 'Never buy brazil nuts' }, correct: false },
    ],
    explanation: { pt: 'Comprar mais barato significa menor custo e maior lucro potencial na revenda.', en: 'Buying cheaper means lower cost and higher potential profit on resale.' },
    reward: 10,
  },
  {
    id: 'aq_08',
    question: { pt: 'Você vendeu 3 unidades de açaí a 18 moedas cada. Quanto recebeu no total?', en: 'You sold 3 units of açaí at 18 coins each. How much did you receive in total?' },
    options: [
      { id: 'a', text: { pt: '54 moedas', en: '54 coins' }, correct: true },
      { id: 'b', text: { pt: '48 moedas', en: '48 coins' }, correct: false },
      { id: 'c', text: { pt: '36 moedas', en: '36 coins' }, correct: false },
      { id: 'd', text: { pt: '60 moedas', en: '60 coins' }, correct: false },
    ],
    explanation: { pt: '3 × 18 = 54 moedas.', en: '3 × 18 = 54 coins.' },
    reward: 10,
  },
  {
    id: 'aq_09',
    question: { pt: 'Qual animal aliado ajuda a render mais com juros compostos?', en: 'Which ally animal helps earn more with compound interest?' },
    options: [
      { id: 'a', text: { pt: 'Preguiça — gera 1% do saldo por rodada', en: 'Sloth — generates 1% of balance per round' }, correct: true },
      { id: 'b', text: { pt: 'Galinha — gera 2 moedas fixas', en: 'Hen — generates 2 fixed coins' }, correct: false },
      { id: 'c', text: { pt: 'Jabuti — reduz cooldown', en: 'Tortoise — reduces cooldown' }, correct: false },
      { id: 'd', text: { pt: 'Macaco — bônus na venda', en: 'Monkey — sales bonus' }, correct: false },
    ],
    explanation: { pt: 'Juros compostos crescem com o saldo. A Preguiça rende mais conforme você acumula moedas.', en: 'Compound interest grows with balance. The Sloth earns more as you accumulate coins.' },
    reward: 15,
  },
  {
    id: 'aq_10',
    question: { pt: 'Você tem 10 ações de um produto a 12 moedas cada. O preço sobe para 20. Quanto vale sua carteira?', en: 'You have 10 shares of a product at 12 coins each. The price rises to 20. How much is your portfolio worth?' },
    options: [
      { id: 'a', text: { pt: '200 moedas', en: '200 coins' }, correct: true },
      { id: 'b', text: { pt: '120 moedas', en: '120 coins' }, correct: false },
      { id: 'c', text: { pt: '80 moedas', en: '80 coins' }, correct: false },
      { id: 'd', text: { pt: '180 moedas', en: '180 coins' }, correct: false },
    ],
    explanation: { pt: '10 × 20 = 200 moedas (lucro de 80 em relação ao custo de 120).', en: '10 × 20 = 200 coins (profit of 80 compared to cost of 120).' },
    reward: 20,
  },
  {
    id: 'aq_11',
    question: { pt: 'O que significa "diversificar investimentos"?', en: 'What does "diversify investments" mean?' },
    options: [
      { id: 'a', text: { pt: 'Repartir o dinheiro em diferentes ativos para reduzir riscos', en: 'Spread money across different assets to reduce risk' }, correct: true },
      { id: 'b', text: { pt: 'Investir tudo em um único ativo de alto retorno', en: 'Put everything into a single high-return asset' }, correct: false },
      { id: 'c', text: { pt: 'Guardar dinheiro sem comprar nada', en: 'Keep money without buying anything' }, correct: false },
      { id: 'd', text: { pt: 'Trocar de investimento todo dia', en: 'Switch investments every day' }, correct: false },
    ],
    explanation: { pt: 'Não colocar todos os ovos na mesma cesta: se um ativo perder valor, os outros compensam.', en: 'Do not put all eggs in one basket: if one asset loses value, others compensate.' },
    reward: 15,
  },
  {
    id: 'aq_12',
    question: { pt: 'Comprou 2 unidades de cacau a 25 cada. Vendeu ambas a 32. Qual o lucro total?', en: 'Bought 2 units of cocoa at 25 each. Sold both at 32. What is the total profit?' },
    options: [
      { id: 'a', text: { pt: '14 moedas', en: '14 coins' }, correct: true },
      { id: 'b', text: { pt: '7 moedas', en: '7 coins' }, correct: false },
      { id: 'c', text: { pt: '64 moedas', en: '64 coins' }, correct: false },
      { id: 'd', text: { pt: '50 moedas', en: '50 coins' }, correct: false },
    ],
    explanation: { pt: 'Lucro por unidade = 32−25 = 7. Total = 2 × 7 = 14 moedas.', en: 'Profit per unit = 32−25 = 7. Total = 2 × 7 = 14 coins.' },
    reward: 20,
  },
  {
    id: 'aq_13',
    question: { pt: 'O que é inflação?', en: 'What is inflation?' },
    options: [
      { id: 'a', text: { pt: 'Aumento geral dos preços ao longo do tempo', en: 'General increase in prices over time' }, correct: true },
      { id: 'b', text: { pt: 'Queda do valor dos produtos', en: 'Fall in the value of products' }, correct: false },
      { id: 'c', text: { pt: 'Imposto sobre compras', en: 'Tax on purchases' }, correct: false },
      { id: 'd', text: { pt: 'Desconto em promoções', en: 'Discount on promotions' }, correct: false },
    ],
    explanation: { pt: 'Inflação é a alta generalizada dos preços, que reduz o poder de compra do dinheiro.', en: 'Inflation is the general rise in prices, which reduces the purchasing power of money.' },
    reward: 10,
  },
  {
    id: 'aq_14',
    question: { pt: 'Você tem 300 moedas e 20 ações. Cada ação vale 8. Qual o seu patrimônio total?', en: 'You have 300 coins and 20 shares. Each share is worth 8. What is your total net worth?' },
    options: [
      { id: 'a', text: { pt: '460 moedas', en: '460 coins' }, correct: true },
      { id: 'b', text: { pt: '300 moedas', en: '300 coins' }, correct: false },
      { id: 'c', text: { pt: '160 moedas', en: '160 coins' }, correct: false },
      { id: 'd', text: { pt: '320 moedas', en: '320 coins' }, correct: false },
    ],
    explanation: { pt: '300 + (20 × 8) = 300 + 160 = 460 moedas.', en: '300 + (20 × 8) = 300 + 160 = 460 coins.' },
    reward: 20,
  },
  {
    id: 'aq_15',
    question: { pt: 'Um produto está com preço muito acima do normal. A estratégia mais lucrativa é:', en: 'A product is priced well above normal. The most profitable strategy is:' },
    options: [
      { id: 'a', text: { pt: 'Vender se você já tiver — o preço pode cair', en: 'Sell if you already have it — the price might fall' }, correct: true },
      { id: 'b', text: { pt: 'Comprar agora para ganhar mais ainda', en: 'Buy now to earn even more' }, correct: false },
      { id: 'c', text: { pt: 'Ignorar o preço e não fazer nada', en: 'Ignore the price and do nothing' }, correct: false },
      { id: 'd', text: { pt: 'Comprar e esperar subir mais', en: 'Buy and wait for it to rise further' }, correct: false },
    ],
    explanation: { pt: 'Quando o preço está muito alto, é o momento de vender — o risco de queda é maior que o ganho potencial.', en: 'When price is very high, it is time to sell — the downside risk exceeds the potential gain.' },
    reward: 15,
  },
  {
    id: 'aq_16',
    question: { pt: 'O que é uma reserva de emergência?', en: 'What is an emergency fund?' },
    options: [
      { id: 'a', text: { pt: 'Dinheiro guardado para situações inesperadas', en: 'Money saved for unexpected situations' }, correct: true },
      { id: 'b', text: { pt: 'Investimento de alto risco', en: 'High-risk investment' }, correct: false },
      { id: 'c', text: { pt: 'Empréstimo bancário', en: 'Bank loan' }, correct: false },
      { id: 'd', text: { pt: 'Dívida para uso futuro', en: 'Debt for future use' }, correct: false },
    ],
    explanation: { pt: 'A reserva de emergência cobre gastos inesperados sem precisar de empréstimo ou vender investimentos.', en: 'An emergency fund covers unexpected expenses without needing a loan or selling investments.' },
    reward: 10,
  },
  {
    id: 'aq_17',
    question: { pt: 'Você ganha 500 moedas por mês e gasta 430. Quanto economiza por mês?', en: 'You earn 500 coins per month and spend 430. How much do you save per month?' },
    options: [
      { id: 'a', text: { pt: '70 moedas', en: '70 coins' }, correct: true },
      { id: 'b', text: { pt: '80 moedas', en: '80 coins' }, correct: false },
      { id: 'c', text: { pt: '50 moedas', en: '50 coins' }, correct: false },
      { id: 'd', text: { pt: '100 moedas', en: '100 coins' }, correct: false },
    ],
    explanation: { pt: '500 − 430 = 70 moedas de poupança.', en: '500 − 430 = 70 coins saved.' },
    reward: 10,
  },
  {
    id: 'aq_18',
    question: { pt: 'O desconto de 25% num produto de 80 moedas equivale a quanto?', en: 'A 25% discount on a product worth 80 coins is how much?' },
    options: [
      { id: 'a', text: { pt: '20 moedas de desconto', en: '20 coins discount' }, correct: true },
      { id: 'b', text: { pt: '25 moedas de desconto', en: '25 coins discount' }, correct: false },
      { id: 'c', text: { pt: '15 moedas de desconto', en: '15 coins discount' }, correct: false },
      { id: 'd', text: { pt: '40 moedas de desconto', en: '40 coins discount' }, correct: false },
    ],
    explanation: { pt: '25% de 80 = 80 × 0,25 = 20 moedas. Preço final: 60 moedas.', en: '25% of 80 = 80 × 0.25 = 20 coins. Final price: 60 coins.' },
    reward: 20,
  },
  {
    id: 'aq_19',
    question: { pt: 'Qual das opções é um exemplo de receita passiva?', en: 'Which of the following is an example of passive income?' },
    options: [
      { id: 'a', text: { pt: 'Juros sobre dinheiro investido', en: 'Interest on invested money' }, correct: true },
      { id: 'b', text: { pt: 'Salário pelo trabalho mensal', en: 'Salary for monthly work' }, correct: false },
      { id: 'c', text: { pt: 'Pagamento por hora trabalhada', en: 'Payment per hour worked' }, correct: false },
      { id: 'd', text: { pt: 'Venda de produto feito por você', en: 'Sale of a product made by you' }, correct: false },
    ],
    explanation: { pt: 'Receita passiva é gerada sem esforço direto — como juros, aluguéis e dividendos.', en: 'Passive income is generated without direct effort — like interest, rent, and dividends.' },
    reward: 15,
  },
  {
    id: 'aq_20',
    question: { pt: 'Você comprou 5 unidades de castanha a 10 moedas cada. Vendeu 3 a 14 cada. Qual o lucro parcial?', en: 'You bought 5 units of brazil nut at 10 coins each. Sold 3 at 14 each. What is the partial profit?' },
    options: [
      { id: 'a', text: { pt: '12 moedas', en: '12 coins' }, correct: true },
      { id: 'b', text: { pt: '14 moedas', en: '14 coins' }, correct: false },
      { id: 'c', text: { pt: '4 moedas', en: '4 coins' }, correct: false },
      { id: 'd', text: { pt: '42 moedas', en: '42 coins' }, correct: false },
    ],
    explanation: { pt: 'Lucro por unidade = 14−10 = 4. 3 vendidas × 4 = 12 moedas de lucro.', en: 'Profit per unit = 14−10 = 4. 3 sold × 4 = 12 coins profit.' },
    reward: 20,
  },
  {
    id: 'aq_21',
    question: { pt: 'Você tem 1000 moedas e 20 ações. Cada ação perdeu 5 moedas de valor. Qual o seu patrimônio?', en: 'You have 1000 coins and 20 shares. Each share lost 5 coins in value. What is your net worth?' },
    options: [
      { id: 'a', text: { pt: 'Depende do preço atual das ações', en: 'Depends on the current share price' }, correct: true },
      { id: 'b', text: { pt: '900 moedas', en: '900 coins' }, correct: false },
      { id: 'c', text: { pt: '1000 moedas', en: '1000 coins' }, correct: false },
      { id: 'd', text: { pt: '1100 moedas', en: '1100 coins' }, correct: false },
    ],
    explanation: { pt: 'Para saber o patrimônio, precisa do preço atual. A perda de 5 por ação = 100 moedas menos em ações (20×5), mas o preço atual define o total.', en: 'To know net worth, you need the current price. A loss of 5 per share = 100 fewer coins in shares (20×5), but the current price defines the total.' },
    reward: 20,
  },
  {
    id: 'aq_22',
    question: { pt: 'Qual a melhor hora para comprar quando os preços estão instáveis?', en: 'What is the best time to buy when prices are volatile?' },
    options: [
      { id: 'a', text: { pt: 'Quando o preço está na baixa histórica recente', en: 'When the price is at a recent historical low' }, correct: true },
      { id: 'b', text: { pt: 'Quando o preço está subindo rapidamente', en: 'When the price is rising quickly' }, correct: false },
      { id: 'c', text: { pt: 'Quando todo mundo está comprando', en: 'When everyone is buying' }, correct: false },
      { id: 'd', text: { pt: 'Quando você está com muitas moedas', en: 'When you have many coins' }, correct: false },
    ],
    explanation: { pt: 'Comprar na baixa reduz o custo médio e maximiza o potencial de lucro na alta.', en: 'Buying at a low reduces average cost and maximizes profit potential on the rise.' },
    reward: 15,
  },
]

/**
 * Retorna questões embaralhadas excluindo as já usadas na sessão.
 * Reinicia o ciclo quando o banco acaba.
 */
export function getArcadeQuestion(usedIds = []) {
  const available = ARCADE_QUESTIONS.filter(q => !usedIds.includes(q.id))
  const pool = available.length > 0 ? available : ARCADE_QUESTIONS
  return pool[Math.floor(Math.random() * pool.length)]
}
