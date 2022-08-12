const statesList = [
  {
    state_code: 'AN',
    state_name: 'Andaman and Nicobar Islands',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643875895/Group_7362andaman_1_jh56ac.svg',
  },
  {
    state_code: 'AP',
    state_name: 'Andhra Pradesh',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643877291/Group_7354andhra_dhfqkx.svg',
  },
  {
    state_code: 'AR',
    state_name: 'Arunachal Pradesh',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643877187/Group_7340arunachal_i2mqek.svg',
  },
  {
    state_code: 'AS',
    state_name: 'Assam',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643874959/Group_7341assam_mafnkb.svg',
  },
  {
    state_code: 'BR',
    state_name: 'Bihar',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643874425/Group_7335bihar_zbj8hr.svg',
  },
  {
    state_code: 'CH',
    state_name: 'Chandigarh',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643875818/Group_7361chandigargh_i4y1ct.svg',
  },
  {
    state_code: 'CT',
    state_name: 'Chhattisgarh',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643875355/Group_7353chattisgarh_nka5kq.svg',
  },
  {
    state_code: 'DN',
    state_name: 'Dadra and Nagar Haveli and Daman and Diu',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643875946/Group_7357daman_xojaml.svg',
  },
  {
    state_code: 'DL',
    state_name: 'Delhi',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643876123/Group_7358delhi_lzftgr.svg',
  },
  {
    state_code: 'GA',
    state_name: 'Goa',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643877071/Group_7349goa_vigjoh.svg',
  },
  {
    state_code: 'GJ',
    state_name: 'Gujarat',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643874554/Group_7337gujarat_myivom.svg',
  },
  {
    state_code: 'HR',
    state_name: 'Haryana',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643874182/Group_7332haryana_j5p8vb.svg',
  },
  {
    state_code: 'HP',
    state_name: 'Himachal Pradesh',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643872638/Group_7364himachal_qzmfyy.svg',
  },
  {
    state_code: 'JK',
    state_name: 'Jammu and Kashmir',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643866939/Group_7328jammu_dgsgns.svg',
  },
  {
    state_code: 'JH',
    state_name: 'Jharkhand',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643874637/Group_7342jharkhand_a2ef27.svg',
  },
  {
    state_code: 'KA',
    state_name: 'Karnataka',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643875591/Group_7339karnataka_keqvvv.svg',
  },
  {
    state_code: 'KL',
    state_name: 'Kerala',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643875646/Group_7355kerala_hy2ctu.svg',
  },
  {
    state_code: 'LA',
    state_name: 'Ladakh',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643876202/Group_7363ladakh_wgfyhj.svg',
  },
  {
    state_code: 'LD',
    state_name: 'Lakshadweep',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643875997/Group_7359lakshadweep_apt34r.svg',
  },
  {
    state_code: 'MH',
    state_name: 'Maharashtra',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643875483/Group_7350maharastra_va3umd.svg',
  },
  {
    state_code: 'MP',
    state_name: 'Madhya Pradesh',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643874482/Group_7336madhyapradesh_pp3zi4.svg',
  },
  {
    state_code: 'MN',
    state_name: 'Manipur',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643875189/Group_7346manipur_bioduk.svg',
  },
  {
    state_code: 'ML',
    state_name: 'Meghalaya',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643875073/Group_7344meghalaya_axne7x.svg',
  },
  {
    state_code: 'MZ',
    state_name: 'Mizoram',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643877350/Group_7347mizeram_vrws31.svg',
  },
  {
    state_code: 'NL',
    state_name: 'Nagaland',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643875133/Group_7345nagaland_pa7ink.svg',
  },
  {
    state_code: 'OR',
    state_name: 'Odisha',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643875408/Group_7348orissa_ogt9qf.svg',
  },
  {
    state_code: 'PY',
    state_name: 'Puducherry',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643876052/Group_7360pudicherry_dqozta.svg',
  },
  {
    state_code: 'PB',
    state_name: 'Punjab',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643874057/Group_7330punjab_uotgvg.png',
  },
  {
    state_code: 'RJ',
    state_name: 'Rajasthan',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643874290/Group_7333rajastan_njuouf.svg',
  },
  {
    state_code: 'SK',
    state_name: 'Sikkim',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643874848/Group_7338sikkim_vzwduv.svg',
  },
  {
    state_code: 'TN',
    state_name: 'Tamil Nadu',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643877485/Group_7356tamilnadu_j91huf.svg',
  },
  {
    state_code: 'TG',
    state_name: 'Telangana',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643875534/Group_7351telangana_gcis15.svg',
  },
  {
    state_code: 'TR',
    state_name: 'Tripura',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643875284/Group_7352tripura_haza0j.svg',
  },
  {
    state_code: 'UP',
    state_name: 'Uttar Pradesh',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643874361/Group_7334uttarpradesh_wmgalk.svg',
  },
  {
    state_code: 'UT',
    state_name: 'Uttarakhand',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643874117/Group_7331uttarakhand_tzke2z.svg',
  },
  {
    state_code: 'WB',
    state_name: 'West Bengal',
    image_url:
      'https://res.cloudinary.com/dyhsyterg/image/upload/v1643874758/Group_7343westbengal_pob4u5.svg',
  },
]

export default statesList
