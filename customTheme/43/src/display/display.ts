export class Display {  
  pg_home_escondeLinkUsuario: boolean;
  pg_home_escondeLinkRedeCredenciada: boolean;
  pg_home_escondeLinkContato: boolean;

  pg_extrato_escondeExtratoAberto: boolean;
  pg_extrato_escondeExtratoUltimo: boolean;
  pg_extrato_escondeExtratoInformado: boolean;
  pg_card_detail_operationsDiv: boolean;
  pg_card_detail_paymentsDiv: boolean;
  pg_card_detail_transferButton: boolean;
  pg_card_detail_cashoutButton: boolean;
  pg_card_detail_ticketPay: boolean;
  pg_home_main_menu_cardRecharge: boolean;
  constructor() {
    //Pagina Home
    this.pg_home_escondeLinkUsuario = false;
    this.pg_home_escondeLinkRedeCredenciada = false;
    this.pg_home_escondeLinkContato = false;
    //Pagina Extrato
    this.pg_extrato_escondeExtratoAberto = true;
    this.pg_extrato_escondeExtratoUltimo = true;
    this.pg_extrato_escondeExtratoInformado = false;
    //Pagina Detalhe Cartao
    this.pg_card_detail_operationsDiv = true;
    this.pg_card_detail_paymentsDiv = true;
    this.pg_card_detail_transferButton = true;
    this.pg_card_detail_cashoutButton = true;
    this.pg_card_detail_ticketPay = true; 
    //Menu Rede Credenciada
    this.pg_home_main_menu_cardRecharge = true;
  }
}