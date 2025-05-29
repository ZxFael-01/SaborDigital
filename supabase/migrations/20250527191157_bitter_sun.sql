/*
  # Update Menu Item Images

  1. Changes
    - Update image URLs for three menu items
    - Maintain existing data integrity
*/

DO $$ 
BEGIN
  -- Update Baião de Dois image
  UPDATE menu_items 
  SET image_url = 'https://i.ytimg.com/vi/9TVEmlFxZGA/maxresdefault.jpg'
  WHERE name = 'Baião de Dois';

  -- Update Acarajé image
  UPDATE menu_items 
  SET image_url = 'https://truffle-assets.tastemadecontent.net/14bd9e85-acaraje_l_thumb.jpg'
  WHERE name = 'Acarajé';

  -- Update Carne de Sol com Macaxeira image
  UPDATE menu_items 
  SET image_url = 'https://espetinhodesucesso.com/wp-content/uploads/2024/10/Carne-de-sol-com-mandioca-na-panela-de-pressao.jpg'
  WHERE name = 'Carne de Sol com Macaxeira';
END $$;